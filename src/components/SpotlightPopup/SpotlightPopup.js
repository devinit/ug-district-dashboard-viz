/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import SpotlightPopupContent from './SpotlightPopupContent';

const SpotlightPopup = (props) => {
  const hideAllPopups = () => {
    const popups = document.querySelectorAll('.popup-content ');
    popups.forEach((popup) => {
      popup.setAttribute('style', 'display:none;');
    });
  };
  const popUpContentStyles = {
    zIndex: 200,
    width: '350px',
    background: '#fff',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '12px',
    color: '#60575d',
    border: 0,
    borderRadius: '0.28571429rem',
    boxShadow: '0 2px 4px 0 rgba(34, 36, 38, 0.12), 0 2px 10px 0 rgba(34, 36, 38, 0.15)',
    padding: '5px',
  };
  const customArrowStyle = {
    height: '10px',
    width: '10px',
    position: 'absolute',
    background: 'rgb(255, 255, 255)',
    transform: 'rotate(225deg)',
    margin: '-5px',
    zIndex: -1,
    boxShadow: 'rgb(0 0 0 / 20%) 1px 1px 1px',
    bottom: '0%',
    left: '82px',
  };

  return (
    <Popup
      trigger={
        <span
          className="spotlight__stat-icon"
          css={css`
            display: inline-flex;
            margin-left: 2px;
            cursor: pointer;
            padding: 8px;
          `}
        >
          <i
            onClick={hideAllPopups}
            role="presentation"
            aria-hidden="true"
            className="ico ico--12 ico-info-slate"
            css={css`
              top: -1px;
            `}
          ></i>
        </span>
      }
      offsetX={20}
      arrowStyle={customArrowStyle}
      position="bottom center"
      closeOnDocumentClick
      contentStyle={popUpContentStyles}
    >
      {(close) => <SpotlightPopupContent close={close} description={props.description} source={props.source} />}
    </Popup>
  );
};

SpotlightPopup.propTypes = {
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  source: PropTypes.string,
};

export default SpotlightPopup;
