import * as Color from 'color';
import PropTypes from 'prop-types';
import React from 'react';

const LegendItem = ({ children, className, bgColor, textColor }) => {
  const color = Color(bgColor);

  return (
    <span className={className} data-testid="spotlight-legend-item">
      {children}
      <style>{`
      span.${className} {
        background-color: ${bgColor || '#D1CBCF'} !important;
        color: ${textColor || color.isLight() ? '#000' : '#FFF'};
      }
    `}</style>
    </span>
  );
};

LegendItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default LegendItem;
