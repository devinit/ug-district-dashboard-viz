import React from 'react';
import PropTypes from 'prop-types';

const TabContentHeader = ({ children, onClick }) => (
  <div className="tabs__content__header" onClick={onClick}>
    {children}
  </div>
);

TabContentHeader.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

export default TabContentHeader;
