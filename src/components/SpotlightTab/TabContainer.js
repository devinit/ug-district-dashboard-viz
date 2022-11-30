import React, { Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import TabContent from './TabContent';

const TabContainer = ({ id, active, label, children, onActivate }) => {
  const renderContent = () =>
    Children.map(children, (child) => (isValidElement(child) && child.type === TabContent ? child : null));

  return (
    <section className="tabs__container" id={id}>
      <input className="tabs__input" type="radio" name="sections" id={`${id}-option`} defaultChecked={active} />
      <label className="tabs__label" htmlFor={`${id}-option`} onClick={onActivate}>
        {label}
      </label>
      {renderContent()}
    </section>
  );
};

TabContainer.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onActivate: PropTypes.func,
  children: PropTypes.any,
};

export default TabContainer;
