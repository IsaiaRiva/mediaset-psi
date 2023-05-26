// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AppUtils from '../../appUtils.js';
import BasePreview from './basePreview.js';

export default class VideoPreview extends BasePreview {
	constructor(media, optionalSearchResults) {
		super(media, optionalSearchResults);
		this.$ids = {
			...this.$ids,
			player: `vjs-${AppUtils.randomHexstring()}`,
		};
		this.$player = undefined;
		this.$subtitleView = $('<div/>').addClass('lead');
		this.$trackCached = {};
		this.$proxyBucket = undefined;
		this.$mediaType = 'video/mp4';
		this.$canvasView = $('<div/>').attr(
			'id',
			`canvas-${AppUtils.randomHexstring()}`
		);
	}

	static get Events() {
		return {
			Track: {
				Loaded: 'v:preview:track:loaded',
			},
		};
	}

	static get Constants() {
		return {
			Subtitle: 'subtitle',
			Track: {
				Kind: 'subtitles', // captions
			},
		};
	}

	get player() {
		return this.$player;
	}

	set player(val) {
		this.$player = val;
	}

	get subtitleView() {
		return this.$subtitleView;
	}

	set subtitleView(val) {
		this.$subtitleView = val;
	}

	get canvasView() {
		return this.$canvasView;
	}

	set canvasView(val) {
		this.$canvasView = val;
	}

	get trackCached() {
		return this.$trackCached;
	}

	set trackCached(val) {
		this.$trackCached = val;
	}

	get proxyBucket() {
		if (!this.$proxyBucket) {
			this.$proxyBucket = this.media.getProxyBucket();
		}
		return this.$proxyBucket;
	}

	set proxyBucket(val) {
		this.$proxyBucket = val;
	}

	get mediaType() {
		return this.$mediaType;
	}

	getSubtitleView() {
		return this.subtitleView;
	}

	getVideoPlayer() {
		return this.player;
	}

	getView() {
		return this.player ? $('video', this.player.el()) : undefined;
	}

	getCanvasView() {
		return this.$canvasView;
	}

	appendSubtitleViewTo(parent) {
		parent.append(this.subtitleView);
		return this;
	}

	async getProxyMedia() {
		return this.media.getProxyVideo();
	}

	async load() {
		await this.unload();
		const [src, poster] = await Promise.all([
			this.getProxyMedia(),
			this.media.getThumbnail(),
		]);
		this.container
			.append(
				$('<video/>')
					.addClass('video-js vjs-fluid w-100')
					.attr('id', this.ids.player)
					.attr('controls', 'controls')
					.attr('preload', 'metadata')
					.attr('poster', poster)
					.attr('crossorigin', 'anonymous')
			)
			.append(this.canvasView);

		const dimension = this.media.getVideoDimension();
		/* workaround: set aspect raio to 16:9 for portrait mode video */
		const aspectRatio = dimension.height > dimension.width ? '16:9' : undefined;
		const player = videojs(this.ids.player, {
			textTrackDisplay: {
				allowMultipleShowingTracks: true,
			},
			aspectRatio,
		});
		player.markers({
			markers: [],
		});
		player.src({
			type: this.mediaType,
			src,
		});
		player.load();
		player.on('play', () => this.canvasView.children().remove());
		this.player = player;

		const subtitleKey = (this.media.getTranscribeResults() || {}).vtt;
		if (subtitleKey) {
			this.trackRegister(VideoPreview.Constants.Subtitle, subtitleKey);
			await this.trackToggle(VideoPreview.Constants.Subtitle, true);
		}
		return super.load();
	}

	async unload() {
		if (this.player) {
			/* store marker plugin for re-initialization */
			this.player.dispose();
		}
		this.player = undefined;
		this.subtitleView.children().remove();
		this.canvasView.children().remove();
		return super.unload();
	}

	async beforeViewHide() {
		if (this.player) {
			this.player.pause();
		}
		return super.beforeViewHide();
	}

	async play() {
		console.log(this);
		if (this.player) {
			this.canvasView.children().remove();
			this.player.play();
		}
		return this;
	}

	async pause() {
		if (this.player) {
			this.player.pause();
		}
		return this;
	}

	async seek(time) {
		if (this.player) {
			this.player.currentTime(time);
		}
		return this;
	}

	getCurrentTime() {
		return this.player
			? Math.floor(this.player.currentTime() * 1000 + 0.5)
			: undefined;
	}

	trackIsSub(trackOrString) {
		return typeof trackOrString === 'string'
			? trackOrString === VideoPreview.Constants.Subtitle
			: (trackOrString || {}).label === VideoPreview.Constants.Subtitle;
	}

	trackIsEnabled(label) {
		if (this.player) {
			const tracks = this.player.remoteTextTracks();
			if (tracks.length === 0) {
				return;
			}
			for (let track of tracks) {
				if (track.label === label) {
					return track.mode === 'showing';
				}
			}
		}
		return false;
	}

	trackRegister(label, key, language = 'en') {
		this.trackCached[label] = {
			key,
			language,
			loaded: false,
		};
		return this;
	}

	trackUnregister(label) {
		delete this.trackCached[label];
		return this;
	}

	async trackLoad(label) {
		if (this.player) {
			const src = await this.media.getUrl(
				this.proxyBucket,
				this.trackCached[label].key
			);
			const track = this.player.addRemoteTextTrack(
				{
					kind: VideoPreview.Constants.Track.Kind,
					language: this.trackCached[label].language,
					label,
					src,
				},
				false
			);
			track.off('load');
			track.on('load', event => {
				const selected = event.target.track;
				selected.mode = 'showing';
				if (this.trackIsSub(label)) {
					selected.off('cuechange');
					selected.on('cuechange', () => this.cueChangedEvent(selected));
				}
				this.trackLoadedEvent(selected);
			});
		}
		return this;
	}

	async trackToggle(label, on) {
		if (this.player) {
			const tracks = this.player.remoteTextTracks();
			if (tracks.length === 0) {
				return;
			}
			for (let track of tracks) {
				if (track.label === label) {
					track.mode = on ? 'showing' : 'hidden';
					return this.markerToggle(track, on);
				}
			}
		}
		/* if track is cached but not loaded, load it now */
		return on && this.trackCached[label] && !this.trackCached[label].loaded
			? this.trackLoad(label)
			: this;
	}

	trackLoadedEvent(track) {
		this.trackCached[track.label].loaded = true;
		if (this.trackIsSub(track)) {
			this.cueToHtml(track);
		} else {
			this.markerAdd(track);
		}
		this.subtitleView.trigger(VideoPreview.Events.Track.Loaded, [track]);
		return this;
	}

	cueChangedEvent(track) {
		if ((track.activeCues || []).length > 0) {
			const active = this.subtitleView.find(
				`[data-cue-index="${track.activeCues[0].id}"]`
			);
			active.addClass('cue-highlight').siblings().removeClass('cue-highlight');
		}
	}

	cueToHtml(track) {
		for (let i = 0; i < track.cues.length; i++) {
			const cue = $(track.cues[i].getCueAsHTML())
				.addClass('d-inline pr-1')
				.attr('data-cue-index', i);
			/* strip leading '--' characters from Amazon Transcribe */
			cue.text(cue.text().replace(/-{2}\s/g, ' '));
			this.subtitleView.append(cue);
		}
	}

	markerAdd(track) {
		const markers = [];
		for (let cue of track.cues) {
			markers.push({
				time: cue.startTime,
				duration: cue.endTime - cue.startTime,
				text: track.label,
				overlayText: track.label,
			});
		}
		this.player.markers.add(markers);
		return this;
	}

	markerRemove(track) {
		const indices = [];
		const markers = this.player.markers.getMarkers();
		for (let i = 0; i < markers.length; i++) {
			if (markers[i].overlayText === track.label) {
				indices.push(i);
			}
		}
		this.player.markers.remove(indices);
		return this;
	}

	markerToggle(track, on) {
		if (track.label === VideoPreview.Constants.Subtitle) {
			return undefined;
		}
		if (on) {
			return this.markerAdd(track);
		}

		return this.markerRemove(track);
	}

	createTrackFromCues(label, cues) {
		if (this.player) {
			const texttrack = this.player.addRemoteTextTrack(
				{
					kind: 'chapters',
					language: 'en',
					label,
				},
				false
			);
			cues.forEach(cue => texttrack.track.addCue(cue));
			texttrack.track.mode = 'hidden';
			return texttrack.track;
		}
		return undefined;
	}

	createAdv() {
		if (this.advVideo) {
			return this.advVideo;
		}
		this.advVideo = document.createElement('video');
		this.advVideo.src =
			'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
		this.advVideo.classList.add('adv-video', 'd-none'); //position
		this.advVideo.setAttribute('controls', true);
		this.advVideo.onended = e => {
			this.advAlreadyPlayed = true;
			this.play();
      console.log(`🧊 ~ e: `, e);
			e.target.classList.remove('d-block');
		};
		return this.advVideo;
	}

	registerAdvListener(value) {
		this.player.off('timeupdate', this.onTimeUpdate);

		this.advAlreadyPlayed = false;
		this.onTimeUpdate = () => {
			console.log(`🧊 ~ d: `, this.getCurrentTime(), value * 1000);
			if (this.advAlreadyPlayed) {
				return;
			}
			if (
				this.getCurrentTime() > value * 1000 &&
				value * 1000 < this.getCurrentTime() + 3000
			) {
				this.pause();
				this.advVideo.classList.add('d-block');
				this.advVideo.currentTime = 0;
				this.advVideo.play().catch(console.error);
			}
		};

		this.player.on('timeupdate', this.onTimeUpdate);
	}
}
