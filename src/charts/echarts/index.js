/* eslint-disable max-len */
export const colorways = {
  rainbow: [
    '#e84439',
    '#eb642b',
    '#f49b21',
    '#109e68',
    '#0089cc',
    '#893f90',
    '#c2135b',
    '#f8c1b2',
    '#f6bb9d',
    '#fccc8e',
    '#92cba9',
    '#88bae5',
    '#c189bb',
    '#e4819b',
  ],
  default: ['#6c120a', '#a21e25', '#cd2b2a', '#dc372d', '#ec6250', '#f6b0a0', '#fbd7cb', '#fce3dc'],
  sunflower: ['#7d4712', '#ba6b15', '#df8000', '#f7a838', '#fac47e', '#fedcab', '#fee7c1', '#feedd4'],
  marigold: ['#7a2e05', '#ac4622', '#cb5730', '#ee7644', '#f4a57c', '#facbad', '#fcdbbf', '#fde5d4'],
  rose: ['#65093d', '#8d0e56', '#9f1459', '#d12568', '#e05c86', '#f3a5b6', '#f6b8c1', '#f9cdd0'],
  lavendar: ['#42184c', '#632572', '#732c85', '#994d98', '#af73ae', '#cb98c4', '#deb5d6', '#ebcfe5'],
  bluebell: ['#0c457b', '#0071b1', '#0089cc', '#5da3d9', '#77adde', '#88bae5', '#bcd4f0', '#d3e0f4'],
  leaf: ['#08492f', '#005b3e', '#00694a', '#3b8c62', '#74bf93', '#a2d1b0', '#b1d8bb', '#c5e1cb'],
  orange: ['#973915', '#d85b31', '#eb642b', '#f18e5e', '#f4a57c', '#f6bb9d'],
  cerulean: ['#1a3e53', '#2b6587', '#357ba5', '#78b1d4', '#ecf4f9', '#0c457b', '#0071b1'],
};

export const getThematicColoursMix = (exclude = ['rainbow']) => {
  const numberOfThematicColours = colorways.default.length;
  const themes = Object.keys(colorways).filter((theme) => !exclude.includes(theme));
  const colours = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const iterator of Array(numberOfThematicColours - 1).keys()) {
    const randomIndex = Math.floor(Math.random() * 7 + 1);
    colours.push(colorways[themes[iterator]][randomIndex]);
  }

  return colours;
};

// default echart options for DI charts
const defaultOptions = {
  legend: {
    top: 10,
    textStyle: {
      fontFamily: 'Geomanist Regular,sans-serif',
    },
  },
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontFamily: 'Geomanist Regular,sans-serif',
    },
    axisPointer: { type: 'none' },
  },
  toolbox: {
    showTitle: false,
    feature: {
      saveAsImage: {
        show: true,
        title: 'Save as image',
        pixelRatio: 2,
      },
    },
    right: 20,
    tooltip: {
      show: true,
      textStyle: {
        fontFamily: 'Geomanist Regular,sans-serif',
        formatter(param) {
          return `<div>${param.title}</div>`; // user-defined DOM structure
        },
      },
    },
  },
  color: colorways.rainbow,
  xAxis: {
    axisLabel: {
      fontFamily: 'Geomanist Regular,sans-serif',
      fontSize: 13,
    },
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    axisLabel: {
      fontFamily: 'Geomanist Regular,sans-serif',
      fontSize: 13,
    },
    splitLine: {
      show: false,
    },
  },
  axisPointer: { type: 'none' },
  grid: {
    top: 10,
  },
};

export const handleResize = (chart, chartNode) => {
  window.addEventListener(
    'onresize',
    () => {
      chart.resize({ width: `${chartNode.clientWidth}px`, height: `${chartNode.clientHeight}px` });
    },
    true
  );
};

export const getYAxisNamePositionFromSeries = (series) => {
  const isStack = series.some((item) => item.stack);
  const seriesCount = Array.from(new Set(series.map((d) => d.name))).length;
  const max = Math.max(
    ...series.reduce((allData, { data }) => allData.concat(data.map((item) => item.value || 0)), [])
  );
  if (max === 0) {
    return 'blank';
  }
  if (isStack ? max * seriesCount < 100 : max < 100) {
    return 'near';
  }
  if (isStack ? max * seriesCount < 1000 : max < 1000) {
    return 'middle';
  }

  return 'far';
};

export default defaultOptions;
