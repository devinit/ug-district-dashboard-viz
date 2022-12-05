import deepMerge from 'deepmerge';
import defaultOptions, { handleResize } from '../charts/echarts/index';
import fetchData from '../utils/data';

const getSeries = (dataArray, subCounty, years) => {
  const schoolTypes = ['Government', 'Private'];
  const series = schoolTypes.map((type) => ({
    name: type,
    type: 'bar',
    stack: 'School type',
    emphasis: {
      focus: 'series',
    },
    data: years.map((year) => {
      const yearList = [];
      dataArray.forEach((item) => {
        if (item.Year === year && item.Type === type) {
          yearList.push(Number(item.Value));
        }
      });
      
return yearList.reduce((accumulator, currentValue) => accumulator + currentValue);
    }),
  }));
  
return series;
};
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
              const { numberOfSchools: schoolData, subCounty } = window.DIState.getState;

              if (!schoolData) {
                window.console.log('Waiting on state update ...');

                return;
              }
              fetchData(schoolData.url).then((data) => {
                const years = Array.from(new Set(data.map((item) => item.Year)));
                const option = {
                  responsive: false,
                  xAxis: [
                    {
                      data: years,
                    },
                  ],
                  yAxis: [
                    {
                      type: 'value',
                    },
                  ],
                  series: getSeries(data, subCounty, years),
                };
                chart.setOption(deepMerge(defaultOptions, option));

                dichart.hideLoading();
              });
            });
          } else {
            window.console.log('State is not defined');
          }

          // add responsiveness
          handleResize(chart, chartNode);
        });
      },
    },
  });
};

export default renderNumberOfSchoolsChart;
