import React from 'react';
import PropTypes from 'prop-types';

const SpotlightTab = ({ children }) => <div className="tabs">{children}</div>;

SpotlightTab.propTypes = {
  children: PropTypes.any,
};

export default SpotlightTab;
