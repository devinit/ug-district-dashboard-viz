import { formatNumber, getYearsFromRange } from '../../utils/data';
import { defaultSelectValue } from '.';

export const parseTableData = (config, data, subCounty) => {
  const { rows: COLUMN_CAPTIONS, mapping } = config;
  const years = getYearsFromRange(config.yearRange);
  const headerRow = ['School Type'].concat(years);
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
