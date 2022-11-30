import React from 'react';
import { createRoot } from 'react-dom/client';
import { fetchData } from '../utils/data';
import { addFilterWrapper } from '../widgets/filters';
import Select from './Select';
import ChartFilters from './ChartFilters';
import dataFile from '../utils/counties.json';

const DATAFILE = dataFile;

const init = (className) => {
  window.DICharts.handler.addChart({
    className,
    d3: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const selectErrorMessage = 'You can compare two donors. Please remove one before adding another.';
          const dichart = new window.DICharts.Chart(chartNode.parentElement);
          dichart.showLoading();

          /**
           * ECharts - prefix all browsers global with window
           * i.e window.echarts - echarts won't work without it
           *
           * const chart = window.echarts.init(chartNode);
           */
          fetchData(DATAFILE).then((data) => {
            console.log(data);
            const selectorFilterWrapper = addFilterWrapper(chartNode);

            // Create dropdowns
            const rootElement = createRoot(selectorFilterWrapper);
            rootElement.render(
              <ChartFilters selectErrorMessage={selectErrorMessage}>
                <Select
                  label="Select Subcounty"
                  options={data.map((d) => ({ value: d.Donors, label: d.Donors }))}
                  classNamePrefix="subcounty-filter sticky-top"
                  isClearable={false}
                  defaultValue={[{ value: 'United States', label: 'United States', isCloseable: true }]}
                  onChange={(item) => {
                    window.DIState.setState({ subCounty: item.value });
                  }}
                  css={{ minWidth: '200px' }}
                />
                <Select
                  label="Select School Level"
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                  ]}
                  classNamePrefix="level-filter sticky-top"
                  isClearable={false}
                  defaultValue={[{ value: 'primary', label: 'Primary', isCloseable: true }]}
                  onChange={(item) => {
                    window.DIState.setState({ level: item.value });
                  }}
                  css={{ minWidth: '200px' }}
                />
              </ChartFilters>
            );
            if (window.DIState) {
              window.DIState.setState({ subCounty: 'United States' });
              window.DIState.setState({ level: 'primary' });
            }

            dichart.hideLoading();
            chartNode.parentElement.classList.add('auto-height');
          });
        });
      },
    },
  });
};

export default init;
