import PropTypes from 'prop-types';
import React from 'react';
import SpotlightPopup from '../SpotlightPopup';

const IndicatorStat = ({ meta = {}, heading, children }) => (
  <div className="spotlight__stat">
    <h3 className="spotlight__stat-heading">
      {heading}
      {meta.description || meta.source ? <SpotlightPopup description={meta.description} source={meta.source} /> : null}
    </h3>
    {children}
  </div>
);

IndicatorStat.defaultProps = { meta: {} };
IndicatorStat.propTypes = {
  heading: PropTypes.string,
  meta: PropTypes.shape({
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    source: PropTypes.string,
  }),
  children: PropTypes.any,
};

export default IndicatorStat;
