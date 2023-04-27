import deepMerge from 'deepmerge';
import defaultOptions, { colorways } from '../../charts/echarts/index';
import { formatNumber, getYearsFromRange } from '../../utils/data';
import { combineMerge } from '../../utils';

export const getYears = (data, config = {}) => {
  if (Array.isArray(config.yearRange) && config.yearRange.length) {
    const years = getYearsFromRange(config.yearRange);

    if (config.excludeYears) {
      return years.filter((year) => !config.excludeYears.includes(year)).map((year) => `${year}`);
    }

    return years.map((year) => `${year}`);
  }

  const yearField = config.mapping && config.mapping.year;
  if (!yearField) return [];

  const yearList = Array.from(new Set(data.map((item) => Number(item[yearField]))));
  const sortedYears = yearList.sort((a, b) => a - b);

  if (config.excludeYears) {
    return sortedYears.filter((year) => !config.excludeYears.includes(year)).map((year) => `${year}`);
  }

  return sortedYears.map((year) => year.toString());
};

const getChartType = (type) => {
  if (!type || ['bar-stacked', 'column-stacked'].includes(type)) return 'bar';

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

const getSeries = (config, data, years) => {
  const { series: seriesNames, mapping } = config;
  const chartType = getChartType(config.type);

  if (chartType !== 'pie') {
    const stack =
      !config.type || ['area', 'bar-stacked', 'column-stacked'].includes(config.type) ? 'district-stack' : undefined;
    // create chart series object
    const series = seriesNames.map((seriesName, index) => ({
      name: seriesName,
      type: chartType,
      stack,
      areaStyle: config.type === 'area' ? {} : undefined,
      smooth: true,
      emphasis: { focus: 'series' },
      symbol: 'circle', // only used for line charts
      label: {
        show: stack && index === seriesNames.length - 1,
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
          if (
            `${item[mapping.year] || ''}` === `${year}` &&
            item[mapping.series].toLowerCase() === seriesName.toLowerCase()
          ) {
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

export const updateChart = ({ data, years, config, chart }) => {
  const options = deepMerge(defaultOptions, {
    responsive: false,
    legend: {
      selectedMode: true,
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
      boundaryGap: config.type !== 'area',
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
    series: getSeries(config, data, years),
  });
  // set colour - has to be done after the options merge above or it won't stick
  options.color = colorways.cerulean;
  chart.setOption(deepMerge(options, config.options || {}, { arrayMerge: combineMerge }));
};
