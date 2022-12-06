import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ExampleTable from './components/ExampleTable';
import { formatNumber, getYearsFromRange } from '../utils/data';
import numberOfSchools from '../../public/assets/data/numberOfSchools.json';

export const YEARS = [2011, 2020];

// Your Code Goes Here i.e. functions
const COLUMN_CAPTIONS = ['Caption One', 'Caption Two'];

const parseTableData = () => {
  const years = getYearsFromRange([2012, 2021]);
  const headerRow = ['Years'].concat(years);
  const sortedSchoolsData = numberOfSchools.sort((a, b) => a.Year - b.Year);
  const dataRows = ['Government', 'Private'].map((purpose) => {
    // school.Year
    const governmentData = {};

    for (let k = 0; k < sortedSchoolsData.length; k++) {
      //   console.log(sortedSchoolsData[k].Type);
      //   console.log(purpose);
      if (!governmentData[sortedSchoolsData[k].Year] && purpose === sortedSchoolsData[k].Type) {
        governmentData[sortedSchoolsData[k].Year] = [];
        governmentData[sortedSchoolsData[k].Year] = [
          ...governmentData[sortedSchoolsData[k].Year],
          parseInt(sortedSchoolsData[k].Value, 10),
        ];
      } else if (purpose === sortedSchoolsData[k].Type) {
        governmentData[sortedSchoolsData[k].Year] = [
          ...governmentData[sortedSchoolsData[k].Year],
          parseInt(sortedSchoolsData[k].Value, 10),
        ];
      }
    }

    // const rowSums = governmentData.map((row) => {

    // });
    const rowSums = {};
    Object.keys(governmentData).forEach((key) => {
      rowSums[key] = governmentData[key].reduce((partialSum, a) => partialSum + a, 0);
    });

    const relevantYears = years.map((year) => rowSums[year]);

    return [purpose].concat(relevantYears);
    // return governmentData;
    // return rowSums;
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

  return [headerRow].concat(formattedDataRow, [totalsRow]);
};

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

  //   const rows = [headerRow].concat(formattedDataRow, [totalsRow]);

  const rows = parseTableData();

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
              const rows = parseTableData();
              console.log(JSON.stringify(rows));
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
