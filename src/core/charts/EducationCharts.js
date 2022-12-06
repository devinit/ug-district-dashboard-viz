import deepMerge from 'deepmerge';
import defaultOptions, { handleResize, colorways } from '../../charts/echarts/index';
import fetchData from '../../utils/data';

const getYears = (data) => {
  const yearList = Array.from(new Set(data.map((item) => Number(item.year))));
  const sortedYears = yearList.sort((a, b) => a - b);
  const sortedStringYears = sortedYears.map((year) => year.toString());

  return sortedStringYears;
};
const getSeries = (dataArray, subCounty, years, level) => {
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
      if ((!subCounty && !level) || (subCounty === 'all' && level === 'all')) {
        dataArray.forEach((item) => {
          if (item.year === year && item.Type === type) {
            yearList.push(Number(item.Value));
          }
        });
      } else if (subCounty && (!level || level === 'all')) {
        dataArray
          .filter((item) => item.SubCounty === subCounty)
          .forEach((item) => {
            if (item.year === year && item.Type === type) {
              yearList.push(Number(item.Value));
            }
          });
      } else if (level && (!subCounty || subCounty === 'all')) {
        dataArray
          .filter((item) => item.level === level)
          .forEach((item) => {
            if (item.year === year && item.Type === type) {
              yearList.push(Number(item.Value));
            }
          });
      } else {
        dataArray
          .filter((item) => item.SubCounty === subCounty && item.level === level)
          .forEach((item) => {
            if (item.year === year && item.Type === type) {
              yearList.push(Number(item.Value));
            }
          });
      }

      return yearList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }),
  }));

  return series;
};
const renderChart = (config) => {
  if (!config.className) return;

  window.DICharts.handler.addChart({
    className: config.className,
    echarts: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const dichart = new window.DICharts.Chart(chartNode.parentElement);

          // Render echarts coding here
          const chart = window.echarts.init(chartNode);

          fetchData(config.url).then((data) => {
            if (window.DIState) {
              window.DIState.addListener(() => {
                dichart.showLoading();
                const { subCounty, level } = window.DIState.getState;

                const option = deepMerge(defaultOptions, {
                  responsive: false,
                  legend: {
                    selectedMode: false,
                  },
                  grid: {
                    top: 60,
                    bottom: 20,
                  },
                  xAxis: {
                    data: getYears(data),
                  },
                  yAxis: {
                    type: 'value',
                    name: 'Number of schools',
                    nameLocation: 'middle',
                    nameGap: 50,
                  },
                  toolbox: {
                    showTitle: false,
                    feature: {
                      saveAsImage: {
                        show: false,
                      },
                    },
                  },
                  series: getSeries(data, subCounty, getYears(data), level),
                });
                option.color = ['#a21e25', '#fbd7cb'].concat(colorways.default);
                chart.setOption(option);

                dichart.hideLoading();
              });
            } else {
              window.console.log('State is not defined');
            }
          });

          // add responsiveness
          handleResize(chart, chartNode);
        });
      },
    },
  });
};

const initCharts = () => {
  if (window.DIState) {
    let configs = [];
    window.DIState.addListener(() => {
      const { charts: chartConfigs } = window.DIState.getState;

      // ensures that the state update that renders the charts only runs once
      if (chartConfigs && configs.length !== chartConfigs.length) {
        configs = chartConfigs;

        configs.forEach(renderChart);
      }
    });
  } else {
    window.console.log('State is not defined');
  }
};

export default initCharts;
