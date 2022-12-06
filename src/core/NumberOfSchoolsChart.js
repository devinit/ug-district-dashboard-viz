import deepMerge from 'deepmerge';
import defaultOptions, { handleResize } from '../charts/echarts/index';
import fetchData from '../utils/data';

const getSeries = (dataArray, subCounty, years) => {
  const filteredData = dataArray.filter((item) => item.SubCounty === subCounty);
  const schoolTypes = ['Government', 'Private'];
  const series = schoolTypes.map((type, index) => ({
    name: type,
    type: 'bar',
    stack: 'School type',
    emphasis: {
      focus: 'series',
    },
    label: {
      show: index === schoolTypes.length - 1,
      position: 'top',
      formatter: (params) => {
        let total = 0;
        series.forEach((serie) => {
          total += serie.data[params.dataIndex];
        });

        return total;
      },
    },
    data: years.map((year) => {
      const yearList = [];
      if (!subCounty || subCounty === 'all') {
        dataArray.forEach((item) => {
          if (item.Year === year && item.Type === type) {
            yearList.push(Number(item.Value));
          }
        });
      } else {
        filteredData.forEach((item) => {
          if (item.Year === year && item.Type === type) {
            yearList.push(Number(item.Value));
          }
        });
      }

      return yearList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
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
