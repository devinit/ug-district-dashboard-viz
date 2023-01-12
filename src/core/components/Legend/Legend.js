import React, { Children } from 'react';
import PropTypes from 'prop-types';

const Legend = ({ children }) => (
  <div className="spotlight-legend" data-testid="spotlight-legend">
    {Children.map(children, (child) => child)}
  </div>
);

Legend.propTypes = {
  children: PropTypes.any,
};

export default Legend;
