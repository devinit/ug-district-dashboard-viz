/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';

const SpotlightPopupContent = ({ close, description, source }) => {
  const renderSourceText = () => {
    if (source) {
      return (
        <React.Fragment>
          <b
            css={css`
              font-family: Geomanist Bold, sans-serif;
            `}
          >
            Source:{' '}
          </b>
          {source}
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <div
      className="spotlight-modal"
      css={css`
        font-size: 12px;
      `}
    >
      <a
        className="close"
        onClick={close}
        css={css`
          cursor: pointer;
          position: absolute;
          display: block;
          padding: 5px 10px;
          line-height: 20px;
          right: 0px;
          top: 0px;
          font-size: 20px;
          background: transparent;
          color: #333131;
          font-weight: 900;
        `}
      >
        &times;
      </a>
      <div
        className="content"
        css={css`
          width: 100%;
          padding: 10px 5px 10px 5px;
        `}
      >
        <p
          className="description"
          css={css`
            font-size: 14px;
          `}
        >
          {description}
        </p>
        {source ? (
          <React.Fragment>
            <br />
            <p
              className="source"
              css={css`
                text-align: left;
              `}
            >
              {renderSourceText()}
            </p>{' '}
          </React.Fragment>
        ) : null}
      </div>
    </div>
  );
};

SpotlightPopupContent.propTypes = {
  description: PropTypes.string,
  source: PropTypes.string,
  close: PropTypes.func.isRequired,
};

export default SpotlightPopupContent;
