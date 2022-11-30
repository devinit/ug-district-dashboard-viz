import { FC, ReactNode } from 'react';

const TabContentHeader: FC<{ onClick?: () => void; children?: ReactNode }> = ({ children, onClick }) => {
  return (
    <div className="tabs__content__header" onClick={onClick}>
      {children}
    </div>
  );
};

export { TabContentHeader };
