import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const TableChartToggler = ({ activeButton = 'chart', className, show, onClickTable, onClickChart }) => {
  if (!show) return null;

  return (
    <div className={classNames('button-group', className)}>
      <button
        type="button"
        className={classNames('button button-sm button-outline', { active: activeButton === 'chart' })}
        onClick={onClickChart}
      >
        Chart
      </button>
      <button
        type="button"
        className={classNames('button button-sm button-outline', { active: activeButton === 'table' })}
        onClick={onClickTable}
      >
        Table
      </button>
    </div>
  );
};

TableChartToggler.propTypes = {
  show: PropTypes.bool,
  onClickChart: PropTypes.func,
  onClickTable: PropTypes.func,
  activeButton: PropTypes.string,
  className: PropTypes.string,
};

export default TableChartToggler;
