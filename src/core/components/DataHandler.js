import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DistrictTable from './DistrictTable';
import { getDefaultFilters } from '../utils/index';
import DistrictChart from './DistrictChart';
import useData from './hooks/charts';
import Selectors from './Selectors';
import { parseTableData } from '../utils/tables';

const DataHandler = (props) => {
  const { data, years, setFilters, updateFilter } = useData(props.config);
  const [showing, setShowing] = useState('chart'); // alternative is "table"

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
          className="spotlight-banner data-selector--wrapper dicharts--selectors--toggler"
        >
          <div className="button-group">
            <button type="button" className="button button-sm" onClick={() => setShowing('chart')}>
              Chart
            </button>
            <button type="button" className="button button-sm" onClick={() => setShowing('table')}>
              Table
            </button>
          </div>
        </Selectors>
      ) : null}
      {showing === 'chart' ? (
        <DistrictChart
          className={classNames({ 'dicharts--padding-top': !props.config.selectors })}
          {...props}
          data={data}
          years={years}
          height={props.config.height}
        />
      ) : null}
      {showing === 'table' && props.config.table ? (
        <DistrictTable rows={parseTableData(props.config.table, data, props.subCounty)} />
      ) : null}
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
