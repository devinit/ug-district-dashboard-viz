import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import DistrictTable from './components/DistrictTable';
import { formatNumber, getYearsFromRange } from '../utils/data';
import numberOfSchools from '../../public/assets/data/numberOfSchools.json';

export const YEARS = [2012, 2021];

const COLUMN_CAPTIONS = ['Government', 'Private'];

const parseTableData = () => {
  const years = getYearsFromRange(YEARS);
  const headerRow = ['Years'].concat(years);
  const dataRows = COLUMN_CAPTIONS.map((purpose) => {
    const schoolNumberByYear = {};
    numberOfSchools.forEach((school) => {
      if (!schoolNumberByYear[school.Year] && purpose === school.Type) {
        schoolNumberByYear[school.Year] = [];
        schoolNumberByYear[school.Year] = [...schoolNumberByYear[school.Year], parseInt(school.Value, 10)];
      } else if (purpose === school.Type) {
        schoolNumberByYear[school.Year] = [...schoolNumberByYear[school.Year], parseInt(school.Value, 10)];
      }
    });

    const schoolSumsByYear = {};
    Object.keys(schoolNumberByYear).forEach((year) => {
      schoolSumsByYear[year] = schoolNumberByYear[year].reduce((partialSum, a) => partialSum + a, 0);
    });

    const relevantYears = years.map((year) => schoolSumsByYear[year]);

    return [purpose].concat(relevantYears);
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
  const rows = parseTableData();

  reactRoot.render(createElement(DistrictTable, { rows }));
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
