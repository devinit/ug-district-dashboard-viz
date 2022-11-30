import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const Legend = ({ data, position }) => (
  <div className={classNames('custom-legend', { right: position === 'right' })}>
    {data.map((d, index) => (
      <div className={classNames('legend-item', { label: d.label })} key={`${index}`}>
        {!d.label && d.colour ? <span className="badge" style={{ backgroundColor: d.colour }} /> : null}
        <span className="text">{d.caption}</span>
      </div>
    ))}
  </div>
);

Legend.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
  position: PropTypes.string,
};

Legend.defaultProps = { data: [] };

export default Legend;
