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

const DataHandler = ({ subCounty = 'all', config, baseAPIUrl }) => {
  const { data, years, setFilters, updateFilter } = useData(config, baseAPIUrl);
  const [showing, setShowing] = useState('chart'); // alternative is "table"
  const [chartType, setChartType] = useState(config.type || 'bar');

  useEffect(() => {
    setFilters(getDefaultFilters(config, subCounty));
  }, []);

  useEffect(() => {
    if (subCounty && config.mapping.subCounty) {
      updateFilter(config.mapping.subCounty, subCounty);
    }
  }, [subCounty]);

  const onChangeSelector = (selector, item) => {
    if (item.value) {
      updateFilter(selector.dataProperty, item.value);
    }
  };

  return (
    <>
      <div
        className={classNames('spotlight-banner data-selector--wrapper dicharts--actions', {
          'align-left': !config.selectors,
        })}
      >
        {config.selectors ? <Selectors configs={config.selectors} onChange={onChangeSelector} /> : null}
        <TableChartToggler
          show={!!config.table}
          onClickChart={() => setShowing('chart')}
          onClickTable={() => setShowing('table')}
          activeButton={showing}
        />
        {showing === 'chart' && config.typeOptions ? (
          <ChartTypeSelector options={config.typeOptions} onChange={setChartType} />
        ) : null}
      </div>
      {showing === 'chart' ? (
        <DistrictChart
          className={classNames({ 'dicharts--padding-top': !config.selectors })}
          config={config}
          subCounty={subCounty}
          data={data}
          years={years}
          height={config.height}
          type={chartType}
        />
      ) : null}
      {showing === 'table' && config.table ? (
        <DistrictTable rows={parseTableData(config.table, data, subCounty)} />
      ) : null}
    </>
  );
};

DataHandler.propTypes = {
  config: PropTypes.object,
  subCounty: PropTypes.string,
  baseAPIUrl: PropTypes.string,
};

export default DataHandler;
