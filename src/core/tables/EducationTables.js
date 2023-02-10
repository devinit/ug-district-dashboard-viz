import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import DistrictTable from '../components/DistrictTable';
import fetchData, { formatNumber, getYearsFromRange } from '../../utils/data';
import renderSelectors from '../SelectorDropdowns';

const parseTableData = (config, data, subCounty, level) => {
  const { rows: COLUMN_CAPTIONS, mapping } = config;
  const years = getYearsFromRange(config.yearRange);
  const headerRow = ['School Type'].concat(years);
  const dataRows = COLUMN_CAPTIONS.map((item) => {
    const valuesByYear = {};
    data
      .filter((row) => years.includes(Number(row[mapping.year])) && row[mapping.rows] === item)
      .filter((row) => (subCounty !== 'all' ? row[mapping.subCounty].toLowerCase() === subCounty.toLowerCase() : true))
      .filter((row) => (level !== 'all' ? row[mapping.level].toLowerCase() === level.toLowerCase() : true))
      .forEach((row) => {
        const yearValues = valuesByYear[row[mapping.year]] || [];
        valuesByYear[row[mapping.year]] = [...yearValues, Number(row[mapping.value])];
      });

    const aggregatedValuesByYear = {};
    Object.keys(valuesByYear).forEach((year) => {
      if (!config.aggregator || config.aggregator === 'sum') {
        aggregatedValuesByYear[year] = valuesByYear[year].reduce((partialSum, a) => partialSum + a, 0);
      } else if (config.aggregator && config.aggregator === 'avg') {
        const sum = valuesByYear[year].reduce((partialSum, a) => partialSum + a, 0);
        aggregatedValuesByYear[year] = sum / valuesByYear[year].length;
      }
    });

    const relevantYears = years.map((year) => (aggregatedValuesByYear[year] ? aggregatedValuesByYear[year] : 0));

    return [item].concat(relevantYears);
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

  if (!config.mapping) {
    window.console.error('Invalid table config: mapping is required!');

    return false;
  }

  if (!config.mapping.rows) {
    window.console.error('Invalid table config: mapping.series is required!');

    return false;
  }

  if (!config.mapping.year) {
    window.console.error('Invalid table config: mapping.year is required!');

    return false;
  }

  if (!config.mapping.value) {
    window.console.error('Invalid table config: mapping.value is required!');

    return false;
  }

  if (!config.mapping.subCounty) {
    window.console.error('Invalid table config: mapping.subCounty is required!');

    return false;
  }

  if (!config.mapping.level) {
    window.console.error('Invalid table config: mapping[mapping.level] is required!');

    return false;
  }

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

            const defaultSubCounty = 'all';
            const defaultLevel = 'all';
            const root = createRoot(tableNode);
            let selectedLevel = defaultLevel;
            let selectedSubCounty = defaultSubCounty;
            window.DIState.addListener(() => {
              dichart.showLoading();
              const { subCounty, level } = window.DIState.getState;
              if (subCounty === selectedSubCounty && level === selectedLevel) return;

              selectedSubCounty = subCounty || defaultSubCounty;
              selectedLevel = level || defaultLevel;
              const filteredData =
                config.filters && config.filters.subCounties
                  ? data.filter((item) => config.filters.subCounties.includes(item[config.mapping.subCounty]))
                  : data;
              const rows = parseTableData(config, filteredData, selectedSubCounty, selectedLevel);
              root.render(createElement(DistrictTable, { rows }));

              if (config.selectors && config.selectors.length) {
                renderSelectors(config.selectorClassName, { selectors: config.selectors });
              }

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
