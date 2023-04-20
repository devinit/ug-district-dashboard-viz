import deepMerge from 'deepmerge';
import defaultOptions, { colorways, handleResize } from '../../charts/echarts/index';
import { combineMerge } from '../../utils';
import fetchData, { formatNumber, getYearsFromRange } from '../../utils/data';
import renderSelectors from '../SelectorDropdowns';
import { defaultSelectValue, filterData, filterDataByProperty, filterDataBySubCounty } from '../utils';

const getYears = (data, yearRange, config = {}) => {
  if (yearRange) return getYearsFromRange(yearRange).map((year) => `${year}`);

  const yearField = config.mapping && config.mapping.year;
  if (!yearField) return [];

  const yearList = Array.from(new Set(data.map((item) => Number(item[yearField]))));
  const sortedYears = yearList.sort((a, b) => a - b);
  const sortedStringYears = sortedYears.map((year) => year.toString());

  return sortedStringYears;
};

const getChartType = (type) => {
  if (!type) return 'bar';

  if (type === 'area') return 'line';

  return type;
};

const getPieSeriesValue = (data, seriesName, config) => {
  const sum = data.reduce((value, curr) => {
    if (curr[config.mapping.series] === seriesName) {
      return value + Number(curr[config.mapping.value]);
    }

    return value;
  }, 0);

  if (!config.aggregator || config.aggregator === 'sum') {
    return sum;
  }
  if (config.aggregator === 'avg') {
    return sum / data.filter((items) => items[config.mapping.series] === seriesName);
  }

  return sum; // leaving room for other aggregators
};

const getSeries = (config, data, subCounty, years) => {
  const { series: seriesNames, mapping } = config;
  const chartType = getChartType(config.type);

  if (chartType !== 'pie') {
    // create chart series object
    const series = seriesNames.map((seriesName, index) => ({
      name: seriesName,
      type: chartType,
      stack: !config.type || ['area', 'bar', 'column'].includes(config.type) ? 'Education' : undefined,
      areaStyle: config.type === 'area' ? {} : undefined,
      smooth: true,
      emphasis: { focus: 'series' },
      label: {
        show: index === seriesNames.length - 1,
        fontFamily: 'Geomanist Regular,sans-serif',
        position: 'top',
        formatter: (params) => {
          let total = 0;
          for (let i = 0; i < series.length; i += 1) {
            total += parseInt(series[i].data[params.dataIndex], 10);
          }

          return formatNumber(total);
        },
      },
      data: years.map((year) => {
        const yearValues = [];
        data.forEach((item) => {
          if (item[mapping.year] === year && item[mapping.series].toLowerCase() === seriesName.toLowerCase()) {
            yearValues.push(Number(item[mapping.value]));
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
  }

  // create pie chart series object
  const series = [
    {
      type: 'pie',
      radius: '50%',
      data: seriesNames.map((seriesName) => ({
        name: seriesName,
        value: getPieSeriesValue(data, seriesName, config),
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: { fontFamily: 'Geomanist Regular,sans-serif' },
    },
  ];

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

  return true;
};

const handleSelectors = async ({ data, config, subCounty, years, chart }, selectorNodes) => {
  // keep track of the current value of all available selectors
  const selectors = config.selectors.map((selector) => ({
    property: selector.dataProperty,
    value: 'all',
  }));

  const onChangeSelector = (selector, item) => {
    const options = chart.getOption();
    const selectedOption = Array.isArray(item) ? item[0].value : item.value;
    if (selectedOption) {
      // update selector value
      const selected = selectors.find((tracker) => tracker.property === selector.config.dataProperty);
      if (selected) {
        selected.value = selectedOption;
        // filter data by all available selectors and their value
        const selectedData = selectors.reduce((filteredData, curr) => {
          if (curr.value === 'all') {
            return filteredData;
          }

          return filterDataByProperty(filteredData, curr.property, curr.value);
        }, data);
        // update chart
        options.series = getSeries(config, selectedData || [], subCounty, years);
        chart.setOption(deepMerge(options, config.options || {}, { arrayMerge: combineMerge }));
      }
    }
  };

  return renderSelectors(config.selectorClassName, {
    selectors: config.selectors,
    onChange: onChangeSelector,
    makeSticky: false,
    nodes: selectorNodes,
  });
};

const updateChart = ({ data, subCounty, years, config, chart }) => {
  const options = deepMerge(defaultOptions, {
    responsive: false,
    legend: {
      selectedMode: false,
    },
    grid: {
      top: 60,
      bottom: 60,
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
    series: getSeries(config, data, subCounty, years),
  });
  // set colour - has to be done after the options merge above or it won't stick
  options.color = colorways.cerulean;
  chart.setOption(deepMerge(options, config.options || {}, { arrayMerge: combineMerge }));
};

const processConfig = (config) => {
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

          fetchData(config.url).then((originalData) => {
            if (window.DIState) {
              // set default sub-county
              let subCounty = defaultSelectValue;
              window.DIState.setState({ subCounty });

              const data = config.filters
                ? filterData(originalData, config.filters) // if available, only include the configured sub-counties
                : originalData;
              // extract year range from data
              const years =
                config.yearRange && config.yearRange.length
                  ? getYears(data, config.yearRange)
                  : getYears(data, null, config);

              let selectors = [];

              // handle sub-county changes.
              const onChangeSubCounty = (selectedSubCounty) => {
                subCounty = selectedSubCounty || defaultSelectValue;
                // filter data by selected sub-county
                const filteredData = filterDataBySubCounty(data, subCounty, config.mapping.subCounty);

                updateChart({ data: filteredData, subCounty, years, chart, config });

                // handle configured inline selectors
                if (config.selectorClassName && config.selectors && config.selectors.length) {
                  handleSelectors({ data: filteredData, subCounty, years, chart, config }, selectors).then(
                    (updatedSelectors) => {
                      selectors = updatedSelectors;
                    }
                  );
                }
              };

              // call for default rendering
              onChangeSubCounty(subCounty);

              // listen & react to changes in global state
              window.DIState.addListener(() => {
                dichart.showLoading();
                const { subCounty: selectedSubCounty } = window.DIState.getState;

                // only update if subcounty changes
                if (!selectedSubCounty || subCounty === selectedSubCounty) {
                  dichart.hideLoading();

                  return;
                }
                onChangeSubCounty(selectedSubCounty);

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
        configs.forEach(processConfig);
      }
    });
  } else {
    window.console.log('State is not defined');
  }
};

export default initCharts;
