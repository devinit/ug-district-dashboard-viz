import PropTypes from 'prop-types';
import React from 'react';

const TableChartToggler = (props) => {
  if (!props.show) return null;

  return (
    <div className="button-group">
      <button type="button" className="button button-sm" onClick={props.onClickChart}>
        Chart
      </button>
      <button type="button" className="button button-sm" onClick={props.onClickTable}>
        Table
      </button>
    </div>
  );
};

TableChartToggler.propTypes = {
  show: PropTypes.bool,
  onClickChart: PropTypes.func,
  onClickTable: PropTypes.func,
};

export default TableChartToggler;
