import React, { FunctionComponent } from 'react';

const TabContent: FunctionComponent = ({ children }) => {
  return (
    <article className="tabs__content">
      {children}
      <style jsx>{`
        z-index: 200;
      `}</style>
    </article>
  );
};

export { TabContent };
