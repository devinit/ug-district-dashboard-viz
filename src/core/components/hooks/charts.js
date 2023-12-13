import { useMemo, useState } from 'react';
import useSWR from 'swr';
import fetchData, { fetchDataFromAPI } from '../../../utils/data';
import { filterData, filterDataByProperty } from '../../utils';
import { getYears } from '../../utils/charts';

const useData = (config, baseAPIUrl, defaultFilters = []) => {
  const { url, yearRange, dataID } = config;
  const { data, error } = useSWR(url || config.className || dataID, async () => {
    if (config.data && Array.isArray(config.data)) {
      return config.data;
    }

    if (url || (dataID && baseAPIUrl)) {
      const dataFetchPromise = url ? fetchData(url) : fetchDataFromAPI(dataID, baseAPIUrl);

      return dataFetchPromise.then((originalData) =>
        config.filters ? filterData(originalData, config.filters) : originalData,
      );
    }

    return [];
  });
  const [filters, setFilters] = useState(defaultFilters);

  if (error) {
    return { data: [], years: [] };
  }

  const years = useMemo(() => {
    if (data) {
      return yearRange && yearRange.length ? getYears(data, config) : getYears(data, config);
    }

    return [];
  }, [data]);
  const filteredData = useMemo(() => {
    if (data && data.length) {
      return filters.length
        ? filters.reduce((lessData, curr) => {
            if (curr.value === 'all') {
              return lessData;
            }

            return filterDataByProperty(lessData, curr.dataProperty, curr.value);
          }, data)
        : data;
    }

    return [];
  }, [data, filters]);

  const updateFilter = (filterId, value) => {
    if (filters && filters.length) {
      setFilters(
        filters.map((filter) => {
          if (filter.dataProperty === filterId) {
            return { ...filter, value };
          }

          return filter;
        }),
      );
    }
  };

  return { data: filteredData, years, filters, setFilters, updateFilter };
};

export default useData;
