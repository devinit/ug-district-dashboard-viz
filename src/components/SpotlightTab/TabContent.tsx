import { FC, ReactNode } from 'react';
import { css } from '@emotion/react';

const TabContent: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <article
      className="tabs__content"
      css={css`
        z-index: 200;
      `}
    >
      {children}
    </article>
  );
};

export { TabContent };
