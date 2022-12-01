import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ExampleTable from './components/ExampleTable';
import { formatNumber, getYearsFromRange } from '../utils/data';

export const YEARS = [2011, 2020];

// Your Code Goes Here i.e. functions
const COLUMN_CAPTIONS = ['Caption One', 'Caption Two'];

const renderTable = (reactRoot) => {
  const years = getYearsFromRange(YEARS);
  const headerRow = ['Caption Column'].concat(years);
  const count = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Array(10).keys()) {
    count.push(key);
  }
  const dataRows = COLUMN_CAPTIONS.map((purpose) => {
    const rowData = count.map(() => Math.random() * 100 + 1);

    return [purpose].concat(rowData);
  });
  const totalsRowCaption = 'Total';
  const totalsRow = headerRow.map((cell, index) => {
    if (index === 0) {
      return totalsRowCaption;
    }

    return formatNumber(
      dataRows.reduce((total, current) => (typeof current[index] === 'number' ? total + current[index] : total), 0)
    );
  });
  // formatting is done after calculating the total to eliminate rounding errors
  const formattedDataRow = dataRows.map((row) =>
    row.map((cell) => (typeof cell === 'number' ? formatNumber(cell) : cell))
  );

  const rows = [headerRow].concat(formattedDataRow, [totalsRow]);

  reactRoot.render(createElement(ExampleTable, { rows }));
};

/**
 * Run your code after the page has loaded
 */
const init = (className) => {
  window.DICharts.handler.addChart({
    className,
    d3: {
      onAdd: (tableNodes) => {
        Array.prototype.forEach.call(tableNodes, (tableNode) => {
          const dichart = new window.DICharts.Chart(tableNode.parentElement);
          dichart.showLoading();

          const root = createRoot(tableNode);
          if (window.DIState) {
            window.DIState.addListener(() => {
              dichart.showLoading();
              const state = window.DIState.getState;
              window.console.log(state);
              // TODO: get and store data in state object
              renderTable(root);
              dichart.hideLoading();
              tableNode.parentElement.classList.add('auto-height');
            });
          } else {
            window.console.log('State is not defined');
          }
        });
      },
    },
  });
};

export default init;
