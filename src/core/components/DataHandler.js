import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { getDefaultFilters } from '../utils/index';
import DistrictChart from './DistrictChart';
import useData from './hooks/charts';
import Selectors from './Selectors';

const DataHandler = (props) => {
  const { data, years, setFilters, updateFilter } = useData(props.config);

  useEffect(() => {
    setFilters(getDefaultFilters(props.config, props.subCounty));
  }, []);

  useEffect(() => {
    const { subCounty, config } = props;
    if (subCounty && config.mapping.subCounty) {
      updateFilter(config.mapping.subCounty, props.subCounty);
    }
  }, [props.subCounty]);

  const onChangeSelector = (selector, item) => {
    updateFilter(selector.dataProperty, item.value);
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
        data={data}
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
