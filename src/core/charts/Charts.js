import React from 'react';
import { createRoot } from 'react-dom/client';
import DataHandler from '../components/DataHandler';
import { defaultSelectValue } from '../utils';

const validConfigs = (config) => {
  if (!config.className) {
    window.console.error('Invalid chart config: className is required!');

    return false;
  }

  if (!config.series || !Array.isArray(config.series)) {
    window.console.error(
      !config.series
        ? 'Invalid chart config: Series is required!'
        : 'Invalid chart config: Invalid series config - expected an array!',
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
    window.console.warn('Potentially invalid chart config: mapping.subCounty may be required!');

    return true;
  }

  return true;
};

const processConfig = (config) => {
  if (!validConfigs(config)) return;

  window.DICharts.handler.addChart({
    className: config.className,
    echarts: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          chartNode.classList.add('dicharts--dimensions');
          chartNode.parentElement.classList.add('auto-height');
          const dichart = new window.DICharts.Chart(chartNode.parentElement);

          dichart.showLoading();
          let subCounty = defaultSelectValue;
          const root = createRoot(chartNode);
          root.render(<DataHandler config={config} subCounty={subCounty} />);

          if (window.DIState) {
            window.DIState.addListener(() => {
              const { subCounty: selectedSubCounty } = window.DIState.getState;
              if (selectedSubCounty && selectedSubCounty !== subCounty) {
                subCounty = selectedSubCounty;
                root.render(<DataHandler config={config} subCounty={subCounty} />);
              }
            });
          }

          dichart.hideLoading();
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
