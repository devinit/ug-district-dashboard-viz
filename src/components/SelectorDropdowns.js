import React from 'react';
import { createRoot } from 'react-dom/client';
import fetchCSVData from '../utils/data';
import { addFilterWrapper } from '../widgets/filters';
import Select from './Select';
import ChartFilters from './ChartFilters';

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
          const csv = 'https://raw.githubusercontent.com/devinit/di-website-data/main/2022/rh-and-fp-dropdowns.csv';
          fetchCSVData(csv).then((data) => {
            const filterWrapper = addFilterWrapper(chartNode);

            // Create dropdowns
            const root = createRoot(filterWrapper);
            root.render(
              <ChartFilters selectErrorMessage={selectErrorMessage}>
                <Select
                  label="Select Subcounty"
                  options={data.map((d) => ({ value: d.Donors, label: d.Donors }))}
                  classNamePrefix="subcounty-filter"
                  isClearable={false}
                  defaultValue={[{ value: 'United States', label: 'United States', isCloseable: true }]}
                  onChange={(item) => {
                    window.DIState.setState({ subCounty: item.value });
                    window.console.log(item.value);
                  }}
                  css={{ minWidth: '100px' }}
                />
                <Select
                  label="Select School Level"
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                  ]}
                  classNamePrefix="level-filter"
                  isClearable={false}
                  defaultValue={[{ value: 'primary', label: 'Primary', isCloseable: true }]}
                  onChange={(item) => {
                    window.DIState.setState({ level: item.value });
                    window.console.log(item.value);
                  }}
                  css={{ minWidth: '100px' }}
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
