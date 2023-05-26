import Localization from '../shared/localization.js';
import mxSpinner from '../mixins/mxSpinner.js';
import BaseTab from '../shared/baseTab.js';
import CustomGraph from '../shared/ui/custom-graph.js';
import VideoPreview from '../shared/media/preview/videoPreview.js';

class AdvTabClass extends mxSpinner(BaseTab) {
	constructor(defaultTab = false) {
		super(Localization.Messages.AdvTab, {
			selected: defaultTab,
		});
	}



	async getJSONAdvAsync() {
		let response = await fetch(
			`https://64637dc64dca1a66135f736b.mockapi.io/mediaset-adv/adv`
		);
		let data = await response.json();
		return data;
	}

	createVideo() {
		const { media, optionalSearchResults } = this.metaVideoData;
		this.playerData = new VideoPreview(media, optionalSearchResults);
		this.playerHtml = $('<div/>')
			.addClass('col-9 p-0 mx-auto mt-3 position-relative')
			.attr('id', 'playerHtml')
			.append(this.playerData.container[0]);
	}

	async playerLoad() {
		await this.playerData.load();
	}

	async playerPLay() {
		await this.playerData.play();
	}

	async videoData({ media, optionalSearchResults }) {
		this.metaVideoData = { media, optionalSearchResults };
		this.createVideo();
		const view = await this.createContent(this.playerData);
		this.tabContent.append(view);
    this.graph.resize()

		this.playerLoad();
	}

	async createContent(playerData) {
		if (!playerData) {
			return;
		}

		const data = await this.getJSONAdvAsync(); // [ ] TODO use real json
		const description = this.createDescription();

		const row = $('<div/>')
			.addClass('row no-gutters')
			.attr('id', 'advTab')
      .append($('<div/>').addClass('col-9 p-0 mx-auto mt-3').append(description))
			.append(
        $('<div/>').addClass('p-1 mx-auto').append(this.createGraph(data))
        )
        .append($('<div/>').addClass('col-9 p-0 mx-auto mt-3')
        .append($('<h3/>').addClass('main-title').html('Preview:')))
			.append(this.playerHtml);
		return row;
	}

	createDescription() {
		return $('<h1/>').addClass('main-title').html('Smart advertising insertion');
	}

	createGraph(data) {
		this.graph = new CustomGraph(data);
		this.graph.setOn('scatter:data:selected', async (event, datapoint) =>
			this.onDataPointSelected(event, datapoint)
		);
		return this.graph.getGraphContainer();
	}

	async onDataPointSelected(_, { value }) {
    if (!this.playerData.getVideoPlayer()) {
      return;
		}
    
    console.log(`🧊 ~ value: `, value);
		this.playerData.seek(value[1] - 10);
		const advVideo = this.playerData.createAdv();
		this.playerData.registerAdvListener(value[1]);

		this.playerPLay();
		await delay(1);

		if (!document.querySelector('.adv-video')) {
			window.playerHtml.appendChild(advVideo);
		}
	}
}

const delay = time => {
	return new Promise(res => {
		setTimeout(res, time * 1000);
	});
};

const AdvTab = new AdvTabClass();
export default AdvTab;
