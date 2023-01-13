import React from 'react';
import PropTypes from 'prop-types';

const LegendItem = ({ children, className, bgColor, textColor }) => (
  <span className={className} data-testid="spotlight-legend-item">
    {children}
    <style>{`
      span.${className} {
        background-color: ${bgColor || '#D1CBCF'} !important;
        color: ${textColor || 'inherit'};
      }
    `}</style>
  </span>
);

LegendItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default LegendItem;
