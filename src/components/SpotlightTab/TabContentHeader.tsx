import React, { FunctionComponent } from 'react';

const TabContentHeader: FunctionComponent<{ onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <div className="tabs__content__header" onClick={onClick}>
      {children}
    </div>
  );
};

export { TabContentHeader };
