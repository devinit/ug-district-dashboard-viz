/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';

const TabContent = ({ children }) => (
  <article
    className="tabs__content"
    css={css`
      z-index: 200;
    `}
  >
    {children}
  </article>
);

TabContent.propTypes = {
  children: PropTypes.any,
};

export default TabContent;
