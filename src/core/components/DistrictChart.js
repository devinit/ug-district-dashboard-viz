import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import fetchData from '../../utils/data';
import { filterData, filterDataBySubCounty } from '../utils';
import { getYears, updateChart } from '../utils/charts';

const DistrictChart = (props) => {
  const ref = useRef(null);
  const [chart, setChart] = useState();
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    if (ref.current) {
      const { url, filters, yearRange } = props.config;
      setChart(window.echarts.init(ref.current));
      fetchData(url).then((originalData) => {
        // if available, only include the configured sub-counties
        const filteredData = filters ? filterData(originalData, filters) : originalData;
        setData(filteredData);
        setYears(yearRange && yearRange.length ? getYears(data, props.config) : getYears(data, props.config));
      });
    }
  }, []);

  useEffect(() => {
    if (chart && data.length && props.subCounty) {
      const { subCounty, config } = props;
      updateChart({
        data: config.mapping.subCounty ? filterDataBySubCounty(data, subCounty, config.mapping.subCounty) : data,
        subCounty,
        years,
        chart,
        config,
      });
    }
  }, [chart, data, props.subCounty]);

  return <div ref={ref} style={{ height: '100%' }} />;
};

DistrictChart.propTypes = {
  config: PropTypes.object,
  subCounty: PropTypes.string,
};

DistrictChart.defaultProps = {
  subCounty: 'all',
};

export default DistrictChart;
