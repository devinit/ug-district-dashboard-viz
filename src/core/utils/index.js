export const defaultSelectValue = 'all';

export const getTabOptions = (options, tabID) => {
  if (!tabID || !options) return null;

  return options.find((item) => item.id === tabID);
};

export const filterDataBySubCounty = (data, subCounty, subCountyProperty) =>
  data.filter((item) => {
    if (!subCounty || subCounty === defaultSelectValue) {
      return true;
    }

    return item[subCountyProperty].toLowerCase() === subCounty.toLowerCase();
  });

export const filterDataByProperty = (data, propertyName, propertyValue) =>
  propertyName && propertyValue
    ? data.filter((item) => item[propertyName].toLowerCase() === propertyValue.toLowerCase())
    : data;

export const filterData = (data, filters) => {
  if (!filters) return data;

  let filteredData = data;
  Object.keys(filters).forEach((column) => {
    filteredData = filteredData.filter((item) =>
      filters[column].includes(typeof item[column] === 'string' ? item[column] : item[column].toString()),
    );
  });

  return filteredData;
};

export const getDefaultFilters = (config, subCounty) => {
  const { mapping, selectors } = config;
  const filterArray = [];
  if (mapping.subCounty && subCounty) {
    filterArray.push({
      dataProperty: mapping.subCounty,
      value: 'all',
    });
  }
  if (selectors) {
    selectors.forEach((selector) => {
      filterArray.push({
        dataProperty: selector.dataProperty,
        value: selector.defaultValue ? selector.defaultValue.value : 'all',
      });
    });
  }

  return filterArray;
};

export const removeCommas = (value) => {
  if ((typeof value === 'string' || value instanceof String) && value.includes(',')) {
    return value.replace(',', '');
  }

  return value;
};
