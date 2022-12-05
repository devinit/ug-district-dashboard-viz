import deepMerge from 'deepmerge';
import defaultOptions, { handleResize } from '../charts/echarts/index';
import fetchData from '../utils/data';

const renderNumberOfSchoolsChart = () => {
  window.DICharts.handler.addChart({
    className: 'number-of-schools-chart',
    echarts: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const dichart = new window.DICharts.Chart(chartNode.parentElement);

          // Render echarts coding here
          const chart = window.echarts.init(chartNode);

          if (window.DIState) {
            window.DIState.addListener(() => {
              dichart.showLoading();
              const { numberOfSchools: schoolData } = window.DIState.getState;

              if (!schoolData) {
                window.console.log('Waiting on state update ...');

                return;
              }
              fetchData(schoolData.url).then((data) => {
                const years = Array.from(new Set(data.map((item) => item.Year)));
                window.console.log(years);
              });
            });
          } else {
            window.console.log('State is not defined');
          }
          const option = {
            responsive: false,
            xAxis: [
              {
                data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'],
              },
            ],
            yAxis: [
              {
                type: 'value',
              },
            ],
            series: [
              {
                name: 'Primary',
                type: 'bar',
                stack: 'School type',
                emphasis: {
                  focus: 'series',
                },
                data: [120, 132, 101, 134, 90, 230, 210],
              },

              {
                name: 'Secondary',
                type: 'bar',
                stack: 'School type',
                emphasis: {
                  focus: 'series',
                },
                data: [150, 232, 201, 154, 190, 330, 410],
              },
            ],
          };
          chart.setOption(deepMerge(defaultOptions, option));

          dichart.hideLoading();

          // add responsiveness
          handleResize(chart, chartNode);
        });
      },
    },
  });
};

export default renderNumberOfSchoolsChart;
