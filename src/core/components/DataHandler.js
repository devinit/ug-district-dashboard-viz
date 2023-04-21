import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import fetchData from '../../utils/data';
import { filterData, filterDataBySubCounty } from '../utils';
import { getYears } from '../utils/charts';
import DistrictChart from './DistrictChart';
import Selectors from './Selectors';

const DataHandler = (props) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const { url, filters, yearRange } = props.config;
    fetchData(url).then((originalData) => {
      // if available, filter data
      const rawData = filters ? filterData(originalData, filters) : originalData;
      setData(rawData);
      setFilteredData(rawData);
      setYears(yearRange && yearRange.length ? getYears(data, props.config) : getYears(data, props.config));
    });
  }, []);

  useEffect(() => {
    const { subCounty, config } = props;
    if (subCounty && config.mapping.subCounty) {
      setFilteredData(filterDataBySubCounty(data, subCounty, config.mapping.subCounty));
    }
  }, [props.subCounty]);

  const onChangeSelector = (selector, item) => {
    console.log(selector, item);
  };

  return (
    <>
      {props.config.selectors ? (
        <Selectors
          configs={props.config.selectors}
          onChange={onChangeSelector}
          className="spotlight-banner data-selector--wrapper"
        />
      ) : null}
      <DistrictChart
        className={classNames({ 'dicharts--padding-top': !props.config.selectors })}
        {...props}
        data={filteredData}
        years={years}
        height={props.config.selectors ? '85%' : '100%'}
      />
    </>
  );
};

DataHandler.propTypes = {
  config: PropTypes.object,
  subCounty: PropTypes.string,
};

DataHandler.defaultProps = {
  subCounty: 'all',
};

export default DataHandler;
