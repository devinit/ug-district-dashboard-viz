import { useMemo, useState } from 'react';
import useSWR from 'swr';
import fetchData from '../../../utils/data';
import { filterData, filterDataByProperty } from '../../utils';
import { getYears } from '../../utils/charts';

const useData = (config, defaultFilters = []) => {
  const { url, yearRange } = config;
  const { data, error } = useSWR(url, () =>
    fetchData(url).then((originalData) => (config.filters ? filterData(originalData, config.filters) : originalData))
  );
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
      return filters.reduce((lessData, curr) => {
        if (curr.value === 'all') {
          return lessData;
        }

        return filterDataByProperty(lessData, curr.dataProperty, curr.value);
      }, data);
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
        })
      );
    }
  };

  return { data: filteredData, years, filters, setFilters, updateFilter };
};

export default useData;
