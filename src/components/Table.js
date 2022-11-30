import PropTypes from 'prop-types';
import React from 'react';

const Table = (props) => (
  <div className="table-styled">
    <table>{props.children}</table>
  </div>
);

Table.propTypes = { children: PropTypes.any };

export default Table;
