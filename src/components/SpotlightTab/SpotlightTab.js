/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';

const SpotlightTab = ({ children }) => (
  <div
    className="tabs"
    css={css`
      z-index: 0;
    `}
  >
    {children}
  </div>
);

SpotlightTab.propTypes = {
  children: PropTypes.any,
};

export default SpotlightTab;
