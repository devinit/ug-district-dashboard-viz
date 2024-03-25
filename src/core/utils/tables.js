import { formatNumber, getYearsFromRange } from '../../utils/data';
import { defaultSelectValue } from '.';

export const parseTableData = (config, data, subCounty) => {
  const { rows: COLUMN_CAPTIONS, mapping, initialHeader } = config;
  const years = getYearsFromRange(config.yearRange).filter(
    (year) => !config.excludeYears || !config.excludeYears.includes(year)
  );
  const headerRow = [initialHeader].concat(years);
  const dataRows = COLUMN_CAPTIONS.map((item) => {
    const valuesByYear = {};
    data
      .filter(
        (row) => years.includes(Number(row[mapping.year])) && row[mapping.rows].toLowerCase() === item.toLowerCase()
      )
      .filter((row) =>
        subCounty !== defaultSelectValue ? row[mapping.subCounty].toLowerCase() === subCounty.toLowerCase() : true
      )
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

export const validConfigs = (config) => {
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

export const parseScoreCardTableData = (config, data, subCounty) => {
  const { rows: INDICATOR_COLUMN_CAPTIONS, mapping, initialHeader } = config;
  const years = getYearsFromRange(config.yearRange).filter(
    (year) => !config.excludeYears || !config.excludeYears.includes(year)
  );
  const headerRow = [initialHeader].concat(years);
  const dataRows = INDICATOR_COLUMN_CAPTIONS.map((item) => {
    const valuesByYear = {};
    data
      .filter(
        (row) => years.includes(Number(row[mapping.year])) && row[mapping.rows].toLowerCase() === item.toLowerCase()
      )
      .filter((row) =>
        subCounty !== defaultSelectValue ? row[mapping.subCounty].toLowerCase() === subCounty.toLowerCase() : true
      )
      .forEach((row) => {
        const yearValues = valuesByYear[row[mapping.year]] || [];
        valuesByYear[row[mapping.year]] = [...yearValues, Number(row[mapping.value])];
      });

    const aggregatedValuesByYear = {};
    Object.keys(valuesByYear).forEach((year) => {
      const sum = valuesByYear[year].reduce((partialSum, a) => partialSum + a, 0);
      aggregatedValuesByYear[year] = sum / valuesByYear[year].length;
    });

    const relevantYears = years.map((year) => (aggregatedValuesByYear[year] ? aggregatedValuesByYear[year] : 0));

    return [item].concat(relevantYears);
  });

  const formattedDataRow = dataRows.map((row) =>
    row.map((cell) => (typeof cell === 'number' ? formatNumber(cell) : cell))
  );

  return [headerRow].concat(formattedDataRow);
};

export const getTableCellColor = (() => {
  // Using a closure here to maintain currentIndicator state
  let currentIndicator = '';

  return (value, config) => {
    if (Object.keys(config).includes(value)) {
      currentIndicator = value;
    }
    if (!value || Number(value) === 0) {
      return '#cdcfd1';
    }

    if (Number(value) >= config[currentIndicator]) {
      return '#3b8c62';
    }
    if (Number(value) >= 0.75 * config[currentIndicator] && Number(value) <= 0.99 * config[currentIndicator]) {
      return '#f7a838';
    }
    if (Number(value) < 0.74 * config[currentIndicator]) {
      return '#cd2b2a';
    }

    return '';
  };
})();
