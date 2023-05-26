import mxReadable from '../../mixins/mxReadable.js';
import AppUtils from '../appUtils.js';
import { dataFoTesting } from '../../testdata.js';


export default class CustomGraph extends mxReadable(class {}) {
	constructor(datasets) {
		super();
		this.$datasets = datasets;
		this.$graphContainer = $('<div/>')
			.addClass('scatter-graph mx-auto')
			.attr('id', `scatter-${AppUtils.randomHexstring()}`);
		const options = this.makeGraphOptions(this.$datasets);
		const graph = echarts.init(this.$graphContainer[0], 'dark', {
      width: 'auto', height: 'auto'
		});
		this.registerGraphEvents(this.$datasets, graph);
		graph.setOption(options);
		this.$graph = graph;
	}

  setOn(event, fn) {
    return this.$graphContainer.on(event, fn);
  }

	getGraphContainer() {
		return this.$graphContainer;
	}

	getGraph() {
		return this.$graph;
	}

  resize() {
    const w  = window.innerWidth - window.innerWidth*0.3;
    const con = document.querySelector('#advTab .scatter-graph')
    con.style.width = `${w}px`;
    con.style.height = `${w/2}px`;
    console.log(`🧊 ~ con: `, con);
    console.log(this.$graph.getWidth(), this.$graph.getHeight(), w)
    return this.$graph.resize({width: w, height: w/2});
  }

	makeGraphOptions(datasets) {
		return {
      responsive: false,
      // maintainAspectRatio: false,
      xAxis: {
        splitLine: {
          show: false
        }
      },
      yAxis: {
        splitLine: {
          show: false
        },
        scale: true
      },
			series: [
				{
          type: 'scatter',
          data: dataFoTesting.map(({id, value, acc}) => [id, value, acc]),
					symbol: 'circle',
          symbolSize: function (acc) {
            return acc;
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(120, 36, 50, 0.5)',
            shadowOffsetY: 5,
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                },
                {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }
              ]
            }
          }
				},
			],
		};
	}

  registerGraphEvents(datasets, graph) {
    const onDataPoint = this.onDataPointClickEvent.bind(this, datasets);
    graph.off('click').on('click', async event => onDataPoint(event));

    // const onLegendChanged = this.onLegendSelectChangedEvent.bind(this, datasets);
    // graph
    //   .off('legendselectchanged')
    //   .on('legendselectchanged', async event => onLegendChanged(event));

    // const onInverseLegends = this.onInverseLegendsEvent.bind(this, datasets);
    // graph
    //   .off('legendinverseselect')
    //   .on('legendinverseselect', async event => onInverseLegends(event));
  }
  


	onDataPointClickEvent(datasets, event) {
		return this.$graphContainer.trigger('scatter:data:selected', [
      event
		]);
	}

}

