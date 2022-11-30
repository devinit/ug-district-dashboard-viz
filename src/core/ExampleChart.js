import React from 'react';
import { createRoot } from 'react-dom/client';
import deepMerge from 'deepmerge';
import defaultOptions, { handleResize } from '../charts/echarts/index';
import { addFilterWrapper } from '../widgets/filters';
import Select from '../components/Select';
import ChartFilters from '../components/ChartFilters';

const updateChart = (chart, data) => {
  const option = {
    series: [
      {
        name: 'Sale',
        type: 'bar',
        data,
      },
    ],
  };
  chart.setOption(deepMerge(option, defaultOptions), { replaceMerge: ['series'] });
};

/**
 * Run your code after the page has loaded
 */
const renderEChart = () => {
  window.DICharts.handler.addChart({
    className: 'dicharts--echarts-boilerplate-chart',
    echarts: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const selectErrorMessage = 'You can compare two donors. Please remove one before adding another.';
          const dichart = new window.DICharts.Chart(chartNode.parentElement);

          // Render echarts coding here
          const chart = window.echarts.init(chartNode);
          const option = {
            responsive: false,
            xAxis: {
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                name: 'Sale',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20, 4],
              },
            ],
          };
          chart.setOption(deepMerge(option, defaultOptions), { replaceMerge: ['series'] });

          const filterWrapper = addFilterWrapper(chartNode);

          // create dropdowns
          const root = createRoot(filterWrapper);
          root.render(
            <ChartFilters selectErrorMessage={selectErrorMessage}>
              <Select
                label="Select multiplier"
                options={[
                  { value: 1, label: 'Chocolate' },
                  { value: 2, label: 'Strawberry' },
                  { value: 3, label: 'Vanilla' },
                ]}
                classNamePrefix="donors-select"
                isClearable={false}
                defaultValue={[{ value: 'chocolate', label: 'Chocolate', isCloseable: true }]}
                onChange={(item) => {
                  window.console.log(item.value);
                  if (item.value) {
                    const updatedData = [5, 20, 36, 10, 10, 20, 4].map((value) => value * Math.random() * item.value);
                    updateChart(chart, updatedData);
                  }
                }}
                css={{ minWidth: '100px' }}
              />
            </ChartFilters>
          );

          dichart.hideLoading();

          // add responsiveness
          handleResize(chart, chartNode);
        });
      },
    },
  });
};

export default renderEChart;
