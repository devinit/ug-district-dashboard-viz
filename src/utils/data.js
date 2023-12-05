import axios from 'axios';
import { parse } from 'papaparse';

const fetchCSVData = (url) =>
  new Promise((resolve) => {
    parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => resolve(data),
    });
  });

export const formatNumber = (value, defaultForNan = '', options = {}) => {
  const formattedNumber = Number(value);

  if (Number.isNaN(formattedNumber)) {
    return defaultForNan;
  }

  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, ...options }).format(formattedNumber);
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

const fetchData = (url) => {
  if (url.endsWith('csv')) {
    return fetchCSVData(url);
  }

  return window.fetch(url).then((response) => response.json());
};

export const fetchDataFromAPI = (dataID, baseAPIUrl) =>
  axios
    .get(`${baseAPIUrl}${dataID}`)
    .then((response) => {
      console.log(response.data.results);

      return response.data.results;
    })
    .catch((error) => error);

export default fetchData;
