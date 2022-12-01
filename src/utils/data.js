import { parse } from 'papaparse';

export const ACTIVE_BRANCH = 'dev';

const fetchCSVData = (url) =>
  new Promise((resolve) => {
    parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => resolve(data),
    });
  });

export const formatNumber = (value, defaultForNan = '') => {
  const formattedNumber = Number(value);

  if (Number.isNaN(formattedNumber)) {
    return defaultForNan;
  }

  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(formattedNumber);
};

export const parseValuesToNumbers = (data, valueField) =>
  data.map((item) => ({
    ...item,
    [valueField]: item[valueField] ? Number(item[valueField]) : 'NA',
  }));

export const getYearsFromRange = (range) => {
  const yearDiff = range[1] - range[0] + 1;
  const count = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Array(yearDiff).keys()) {
    count.push(key);
  }

  return count.map((key) => range[0] + key);
};

export const fetchData = (dataFile) => {
  if (dataFile.includes('csv')) {
    return fetchCSVData(dataFile);
  }

  return new Promise((resolve) => {
    resolve(dataFile);
  });
};

export default fetchCSVData;
