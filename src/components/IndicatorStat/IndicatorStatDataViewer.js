/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import SpotlightPopup from '../SpotlightPopup';

const IndicatorStatDataViewer = ({ value, note }) => (
  <p className="spotlight__stat-data">
    {value}
    {note && note.content ? (
      <span
        className="spotlight__stat-data__note"
        css={css`
          transform: none;
          position: relative;
          top: -10px;
        `}
      >
        {note.content}{' '}
        {note.meta ? <SpotlightPopup description={note.meta.description} source={note.meta.source} /> : null}
      </span>
    ) : null}
  </p>
);

IndicatorStatDataViewer.propTypes = {
  note: PropTypes.obj,
  value: PropTypes.string,
};

export default IndicatorStatDataViewer;
