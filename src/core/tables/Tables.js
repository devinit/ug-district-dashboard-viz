import React from 'react';
import { createRoot } from 'react-dom/client';
import fetchData, { fetchDataFromAPI } from '../../utils/data';
import DistrictTable from '../components/DistrictTable';
import renderSelectors from '../SelectorDropdowns';
import { defaultSelectValue, filterDataByProperty, filterDataBySubCounty } from '../utils';
import { parseScoreCardTableData, parseTableData, validConfigs } from '../utils/tables';
import ScoreCardTable from '../components/ScoreCardTable';

const handleSelectors = async ({ data, config, subCounty, tableRoot }, selectorNodes, tableType, thresholds) => {
  // keep track of the current value of all available selectors
  const selectors = config.selectors.map((selector) => ({
    property: selector.dataProperty,
    value: defaultSelectValue
  }));

  const onChangeSelector = (selector, item) => {
    const selectedOption = Array.isArray(item) ? item[0].value : item.value;
    if (selectedOption) {
      // update selector value
      const selected = selectors.find((tracker) => tracker.property === selector.config.dataProperty);
      if (selected) {
        selected.value = selectedOption;
        // filter data by all available selectors and their value
        const selectedData = selectors.reduce((filteredData, curr) => {
          if (curr.value === defaultSelectValue) {
            return filteredData;
          }

          return filterDataByProperty(filteredData, curr.property, curr.value);
        }, data);
        // update table
        if (tableType === 'scoreCard') {
          const rows = parseScoreCardTableData(config, selectedData, subCounty);
          tableRoot.render(<ScoreCardTable rows={rows} thresholds={thresholds} />);
        } else {
          const rows = parseTableData(config, selectedData, subCounty);
          tableRoot.render(<DistrictTable rows={rows} />);
        }
      }
    }
  };

  return renderSelectors(config.selectorClassName, {
    selectors: config.selectors,
    onChange: onChangeSelector,
    makeSticky: false,
    nodes: selectorNodes
  });
};

const renderTable = (config) => {
  if (!validConfigs(config)) return;

  window.DICharts.handler.addChart({
    className: config.className,
    d3: {
      onAdd: (tableNodes) => {
        if (window.DIState) {
          const { baseAPIUrl } = window.DIState.getState;
          const dataFetchPromise = config.url ? fetchData(config.url) : fetchDataFromAPI(config.dataID, baseAPIUrl);
          dataFetchPromise.then((data) => {
            Array.prototype.forEach.call(tableNodes, (tableNode) => {
              const dichart = new window.DICharts.Chart(tableNode.parentElement);
              dichart.showLoading();

              const defaultSubCounty = defaultSelectValue;
              const root = createRoot(tableNode);
              let selectedSubCounty = defaultSubCounty;
              let selectors = [];

              window.DIState.addListener(() => {
                dichart.showLoading();
                const { subCounty } = window.DIState.getState;
                const { tableType, thresholds } = config;
                if (subCounty === selectedSubCounty) return;

                selectedSubCounty = subCounty || defaultSubCounty;
                const filteredData =
                  config.filters && config.filters.subCounties
                    ? filterDataBySubCounty(data, selectedSubCounty, config.mapping.subCounty)
                    : data;
                if (tableType === 'scoreCard') {
                  const rows = parseScoreCardTableData(config, filteredData, selectedSubCounty);
                  root.render(<ScoreCardTable rows={rows} thresholds={thresholds} />);
                } else {
                  const rows = parseTableData(config, filteredData, selectedSubCounty);
                  root.render(<DistrictTable rows={rows} />);
                }

                if (config.selectors && config.selectors.length) {
                  handleSelectors(
                    { data: filteredData, subCounty: selectedSubCounty, config, tableRoot: root },
                    selectors,
                    tableType,
                    thresholds
                  ).then((updatedSelectors) => {
                    selectors = updatedSelectors;
                  });
                }

                dichart.hideLoading();
                tableNode.parentElement.classList.add('auto-height');
              });
            });
          });
        }
      }
    }
  });
};

const initTables = () => {
  if (window.DIState) {
    let configs = [];
    window.DIState.addListener(() => {
      const { tables: tableConfigs } = window.DIState.getState;

      // ensures that the state update that renders the charts only runs once
      if (tableConfigs && configs.length !== tableConfigs.length) {
        configs = tableConfigs;

        configs.forEach((config) => {
          renderTable(config);
        });
      }
    });
  } else {
    window.console.log('State is not defined');
  }
};

export default initTables;
