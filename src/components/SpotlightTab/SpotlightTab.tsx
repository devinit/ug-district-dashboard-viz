import { FC, ReactNode } from 'react';

const SpotlightTab: FC<{ children: ReactNode }> = ({ children }) => <div className="tabs">{children}</div>;

export { SpotlightTab };
