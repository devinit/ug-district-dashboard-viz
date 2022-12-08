import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import DistrictTable from '../components/DistrictTable';
import fetchData, { formatNumber, getYearsFromRange } from '../../utils/data';

const parseTableData = (data, subCounty, level) => {
  const years = getYearsFromRange([2012, 2021]);
  const COLUMN_CAPTIONS = ['Government', 'Private'];
  const headerRow = ['Years'].concat(years);
  const dataRows = COLUMN_CAPTIONS.map((purpose) => {
    const numberOfSchoolsByYear = {};
    data
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
const validConfigs = (config) => {
  if (!config.className) {
    window.console.error('Invalid table config: className is required!');

    return false;
  }

  // if (!config.mapping) {
  //   window.console.error('Invalid chart config: mapping is required!');

  //   return false;
  // // }

  // if (!config.mapping.series) {
  //   window.console.error('Invalid chart config: mapping.series is required!');

  //   return false;
  // }

  // if (!config.mapping.year) {
  //   window.console.error('Invalid chart config: mapping.year is required!');

  //   return false;
  // }

  // if (!config.mapping.value) {
  //   window.console.error('Invalid chart config: mapping.value is required!');

  //   return false;
  // }

  // if (!config.mapping.subCounty) {
  //   window.console.error('Invalid chart config: mapping.subCounty is required!');

  //   return false;
  // }

  // if (!config.mapping.level) {
  //   window.console.error('Invalid chart config: mapping[mapping.level] is required!');

  //   return false;
  // }

  return true;
};
const renderTable = (config) => {
  if (!validConfigs(config)) return;

  window.DICharts.handler.addChart({
    className: config.className,
    d3: {
      onAdd: (tableNodes) => {
        fetchData(config.url).then((data) => {
          Array.prototype.forEach.call(tableNodes, (tableNode) => {
            const dichart = new window.DICharts.Chart(tableNode.parentElement);
            dichart.showLoading();

            const root = createRoot(tableNode);
            window.DIState.addListener(() => {
              dichart.showLoading();
              const { subCounty, level } = window.DIState.getState;
              const rows = parseTableData(data, subCounty, level);
              root.render(createElement(DistrictTable, { rows }));
              dichart.hideLoading();
              tableNode.parentElement.classList.add('auto-height');
            });
          });
        });
      },
    },
  });
};

const initTables = () => {
  if (window.DIState) {
    let configs = [];
    window.DIState.addListener(() => {
      const { tables: tableConfigs } = window.DIState.getState;

      // ensures that the state update that renders the charts only runs once
      if (tableConfigs && configs.length !== tableConfigs.length) {
        configs = tableConfigs.filter((config) => config.target === 'education');

        configs.forEach(renderTable);
      }
    });
  } else {
    window.console.log('State is not defined');
  }
};

export default initTables;
