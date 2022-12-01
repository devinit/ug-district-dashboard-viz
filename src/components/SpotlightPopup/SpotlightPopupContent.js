/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';

const SpotlightPopupContent = ({ close, description, source }) => {
  const renderSourceText = () => {
    if (source) {
      return (
        <>
          <b
            css={css`
              font-family: Geomanist Bold, sans-serif;
            `}
          >
            Source:{' '}
          </b>
          {source}
        </>
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
          padding: 20px 5px 5px 5px;
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
        <br />
        <p
          className="source"
          css={css`
            text-align: left;
          `}
        >
          {renderSourceText()}
        </p>
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
