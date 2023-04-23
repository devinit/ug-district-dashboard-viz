import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const TableChartToggler = (props) => {
  if (!props.show) return null;

  return (
    <div className="button-group">
      <button
        type="button"
        className={classNames('button button-sm button-outline', { active: props.activeButton === 'chart' })}
        onClick={props.onClickChart}
      >
        Chart
      </button>
      <button
        type="button"
        className={classNames('button button-sm button-outline', { active: props.activeButton === 'table' })}
        onClick={props.onClickTable}
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
};

TableChartToggler.defaultProps = { activeButton: 'chart' };

export default TableChartToggler;
