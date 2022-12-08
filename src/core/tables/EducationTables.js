import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import DistrictTable from '../components/DistrictTable';
import { formatNumber, getYearsFromRange } from '../../utils/data';
import masindiSchoolData from '../../../public/assets/data/masindi/numberOfSchools.json';

const parseTableData = (subCounty, level) => {
  const years = getYearsFromRange([2012, 2021]);
  const COLUMN_CAPTIONS = ['Government', 'Private'];
  const headerRow = ['Years'].concat(years);
  const dataRows = COLUMN_CAPTIONS.map((purpose) => {
    const numberOfSchoolsByYear = {};
    masindiSchoolData
      .filter((school) =>
        subCounty && subCounty !== 'all' ? school.SubCounty.toLowerCase() === subCounty.toLowerCase() : true
      )
      .filter((school) => (level && level !== 'all' ? school.level.toLowerCase() === level.toLowerCase() : true))
      .forEach((school) => {
        if (!numberOfSchoolsByYear[school.year] && purpose === school.Type) {
          numberOfSchoolsByYear[school.year] = [];
          numberOfSchoolsByYear[school.year] = [...numberOfSchoolsByYear[school.year], parseInt(school.Value, 10)];
        } else if (purpose === school.Type) {
          numberOfSchoolsByYear[school.year] = [...numberOfSchoolsByYear[school.year], parseInt(school.Value, 10)];
        }
      });

    const schoolSumsByYear = {};
    Object.keys(numberOfSchoolsByYear).forEach((year) => {
      schoolSumsByYear[year] = numberOfSchoolsByYear[year].reduce((partialSum, a) => partialSum + a, 0);
    });

    const relevantYears = years.map((year) => (schoolSumsByYear[year] ? schoolSumsByYear[year] : 0));

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
  const { subCounty, level } = window.DIState.getState;
  const rows = parseTableData(subCounty, level);
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
