import deepMerge from 'deepmerge';
import defaultOptions, { handleResize, colorways } from '../../charts/echarts/index';
import { combineMerge } from '../../utils';
import fetchData, { formatNumber, getYearsFromRange } from '../../utils/data';
import renderSelectors from '../SelectorDropdowns';

const defaultSubCounty = 'all';
const defaultLevel = 'all';
const defaultOwnership = 'all';
const getYears = (data, yearRange) => {
  if (yearRange) return getYearsFromRange(yearRange).map((year) => `${year}`);

  const yearList = Array.from(new Set(data.map((item) => Number(item.year))));
  const sortedYears = yearList.sort((a, b) => a - b);
  const sortedStringYears = sortedYears.map((year) => year.toString());

  return sortedStringYears;
};
const getChartType = (type) => {
  if (!type) return 'bar';

  if (type === 'area') return 'line';

  return type;
};
const getSeries = (config, dataArray, subCounty, years, level, ownership) => {
  const { series: seriesNames, mapping } = config;
  const series = seriesNames.map((seriesName, index) => ({
    name: seriesName,
    type: getChartType(config.type),
    ...(config.className !== 'dicharts--ple-performance-analysis' && {
      stack: !config.type || ['area', 'bar', 'column'].includes(config.type) ? 'School Type' : undefined,
    }),
    areaStyle: config.type === 'area' ? {} : undefined,
    smooth: true,
    emphasis: {
      focus: 'series',
    },
    label: {
      show: config.className !== 'dicharts--ple-performance-analysis' ? index === seriesNames.length - 1 : true,
      position: 'top',
      formatter: (params) => {
        let total = 0;
        for (let i = 0; i < series.length; i += 1) {
          if (series[i].name === seriesName && config.className === 'dicharts--ple-performance-analysis') {
            total = parseInt(series[i].data[params.dataIndex], 10);
            break;
          } else {
            total += parseInt(series[i].data[params.dataIndex], 10);
          }
        }

        return formatNumber(total);
      },
    },
    data: years.map((year) => {
      const yearValues = [];
      dataArray
        .filter((item) => {
          if (
            (!subCounty && !level && !ownership) ||
            (subCounty === defaultSubCounty &&
              level === defaultLevel &&
              (ownership === undefined || ownership === defaultOwnership))
          ) {
            return true;
          }
          if (subCounty && (!level || level === defaultLevel) && (!ownership || ownership === defaultOwnership)) {
            return item[mapping.subCounty].toLowerCase() === subCounty.toLowerCase();
          }
          if (
            level &&
            (!subCounty || subCounty === defaultSubCounty) &&
            (!ownership || ownership === defaultOwnership)
          ) {
            return item[mapping.level]
              ? item[mapping.level].toLowerCase() === level.toLowerCase()
              : !item[mapping.level];
          }
          if (ownership && (!subCounty || subCounty === defaultSubCounty)) {
            return item[mapping.ownership]
              ? item[mapping.ownership].toLowerCase() === ownership.toLowerCase()
              : !item[mapping.ownership];
          }
          if (ownership && subCounty) {
            return item[mapping.ownership]
              ? item[mapping.ownership].toLowerCase() === ownership.toLowerCase()
              : !item[mapping.ownership] && item[mapping.subCounty].toLowerCase() === subCounty.toLowerCase();
          }

          return (
            item[mapping.subCounty].toLowerCase() === subCounty.toLowerCase() &&
            item[mapping.level].toLowerCase() === level.toLowerCase()
          );
        })
        .forEach((item) => {
          if (item[mapping.year] === year && item[mapping.series].toLowerCase() === seriesName.toLowerCase()) {
            yearValues.push(Number(item[mapping.value]));
          } else if (item[mapping.year] === year && config.className === 'dicharts--ple-performance-analysis') {
            yearValues.push(Number(item[mapping[seriesName.toLowerCase().split(' ').join('_')]]));
          }
        });

      if (!config.aggregator || config.aggregator === 'sum') {
        return yearValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      }
      if (config.aggregator === 'avg') {
        const sum = yearValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        return formatNumber(sum / yearValues.length);
      }

      throw new Error('Invalid aggregator: ', config.aggregator);
    }),
  }));

  return series;
};
const validConfigs = (config) => {
  if (!config.className) {
    window.console.error('Invalid chart config: className is required!');

    return false;
  }

  if (!config.series || !Array.isArray(config.series)) {
    window.console.error(
      !config.series
        ? 'Invalid chart config: Series is required!'
        : 'Invalid chart config: Invalid series config - expected an array!'
    );

    return false;
  }

  if (!config.mapping) {
    window.console.error('Invalid chart config: mapping is required!');

    return false;
  }

  if (!config.mapping.series) {
    window.console.error('Invalid chart config: mapping.series is required!');

    return false;
  }

  if (!config.mapping.year) {
    window.console.error('Invalid chart config: mapping.year is required!');

    return false;
  }

  if (!config.mapping.value) {
    window.console.error('Invalid chart config: mapping.value is required!');

    return false;
  }

  if (!config.mapping.subCounty) {
    window.console.error('Invalid chart config: mapping.subCounty is required!');

    return false;
  }

  if (!config.mapping.level) {
    window.console.error('Invalid chart config: mapping[mapping.level] is required!');

    return false;
  }

  return true;
};
const renderChart = (config) => {
  if (!validConfigs(config)) return;

  window.DICharts.handler.addChart({
    className: config.className,
    echarts: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          chartNode.classList.add('dicharts--dimensions', 'dicharts--padding-top');
          const dichart = new window.DICharts.Chart(chartNode.parentElement);

          // Render echarts coding here
          const chart = window.echarts.init(chartNode);

          fetchData(config.url).then((data) => {
            if (window.DIState) {
              let subCounty = defaultSubCounty;
              let level = defaultLevel;
              const filteredData =
                config.filters && config.filters.subCounties
                  ? data.filter((item) => config.filters.subCounties.includes(item[config.mapping.subCounty]))
                  : data;

              window.DIState.addListener(() => {
                dichart.showLoading();
                const { subCounty: selectedSubCounty, level: selectedLevel, ownership } = window.DIState.getState;

                // only update if subcounty or level have changed
                if (subCounty === selectedSubCounty && level === selectedLevel) return;

                subCounty = selectedSubCounty || defaultSubCounty;
                level = selectedLevel || defaultLevel;

                const years = getYears(filteredData, config.yearRange);
                const options = deepMerge(defaultOptions, {
                  responsive: false,
                  legend: {
                    selectedMode: false,
                  },
                  grid: {
                    top: 60,
                    bottom: 20,
                  },
                  xAxis: {
                    data: years,
                    nameTextStyle: {
                      verticalAlign: 'top',
                    },
                    name: 'Years',
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
                  series: getSeries(config, filteredData, subCounty, years, level, ownership),
                });
                options.color = ['#a21e25', '#fbd7cb'].concat(colorways.default);
                chart.setOption(deepMerge(options, config.options || {}, { arrayMerge: combineMerge }));

                if (config.selectors && config.selectors.length) {
                  renderSelectors(config.selectorClassName, { selectors: config.selectors });
                }

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
        configs = chartConfigs.filter((config) => config.target === 'education');

        configs.forEach(renderChart);
      }
    });
  } else {
    window.console.log('State is not defined');
  }
};

export default initCharts;
