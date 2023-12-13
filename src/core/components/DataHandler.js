import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getDefaultFilters } from '../utils/index';
import { parseTableData } from '../utils/tables';
import ChartTypeSelector from './ChartTypeSelector';
import DistrictChart from './DistrictChart';
import DistrictTable from './DistrictTable';
import useData from './hooks/charts';
import Selectors from './Selectors';
import TableChartToggler from './TableChartToggler';

const DataHandler = (props) => {
  const { data, years, setFilters, updateFilter } = useData(props.config, props.baseAPIUrl);
  const [showing, setShowing] = useState('chart'); // alternative is "table"
  const [chartType, setChartType] = useState(props.config.type || 'bar');

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
      <div
        className={classNames('spotlight-banner data-selector--wrapper dicharts--actions', {
          'align-left': !props.config.selectors,
        })}
      >
        {props.config.selectors ? <Selectors configs={props.config.selectors} onChange={onChangeSelector} /> : null}
        <TableChartToggler
          show={!!props.config.table}
          onClickChart={() => setShowing('chart')}
          onClickTable={() => setShowing('table')}
          activeButton={showing}
        />
        {showing === 'chart' && props.config.typeOptions ? (
          <ChartTypeSelector options={props.config.typeOptions} onChange={setChartType} />
        ) : null}
      </div>
      {showing === 'chart' ? (
        <DistrictChart
          className={classNames({ 'dicharts--padding-top': !props.config.selectors })}
          {...props}
          data={data}
          years={years}
          height={props.config.height}
          type={chartType}
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
  baseAPIUrl: PropTypes.string,
};

DataHandler.defaultProps = {
  subCounty: 'all',
};

export default DataHandler;
