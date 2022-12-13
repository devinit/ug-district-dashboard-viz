/** @jsx jsx */
import { css, Global, jsx } from '@emotion/react';
import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { BaseMapLayer } from './BaseMapLayer';

const defaultStyles = {
  width: '100%', // spotlights default
  position: 'absolute',
  top: 0,
  bottom: 0,
  background: '#F3F3F3', // spotlights default
};

const BaseMap = (props) => {
  mapbox.accessToken = props.accessToken;
  const mapNode = useRef(null);
  const [baseMap, setBaseMap] = useState(undefined);

  useEffect(() => {
    if (mapNode && mapNode.current) {
      const map = new mapbox.Map({
        container: mapNode.current,
        ...props.options,
      });

      if (props.showNavigationControls) {
        map.addControl(new mapbox.NavigationControl());
      }

      map.on('load', (event) => {
        setBaseMap(map);
        if (props.onLoad) {
          props.onLoad(map, event);
        }
      });
    }
  }, []);

  const renderLayers = () =>
    Children.map(props.children, (child) =>
      isValidElement(child) && child.type === BaseMapLayer ? cloneElement(child, { map: baseMap }) : null
    );

  return (
    <div
      ref={mapNode}
      style={{ ...defaultStyles, ...props.style }}
      css={css`
        background: ${props.background};
        font-family: geomanist, sans-serif;
      `}
    >
      {renderLayers()}
      <Global
        styles={css`
          div .mapboxgl-canary {
            background: red;
          }

          div .mapboxgl-popup {
            z-index: 400;
            max-width: 100% !important;
          }

          div .mapboxgl-popup-content {
            background-color: rgba(0, 0, 0, 0.9) !important;
            box-shadow: none !important;
            color: #ffffff !important;
            font-family: geomanist, sans-serif;
            -webkit-tap-highlight-color: black;
            opacity: 0.8;
            padding: 20px;
          }

          div .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
            border-top-color: rgba(0, 0, 0, 0.9);
            opacity: 0.8;
          }

          div .mapboxgl-popup-content .mapBox-popup p {
            margin-bottom: 0;
          }

          div .mapboxgl-popup-content .mapboxgl-popup-close-button {
            color: #ffffff;
            font-size: 1.8rem;
          }
        `}
      />
    </div>
  );
};

BaseMap.defaultProps = {
  style: defaultStyles,
  options: {
    minZoom: 6,
    zoom: 6.1,
  },
  showNavigationControls: true,
  background: 'inherit',
};

BaseMap.propTypes = {
  accessToken: PropTypes.string,
  style: PropTypes.object,
  background: PropTypes.string,
  showNavigationControls: PropTypes.bool,
  onLoad: PropTypes.func,
  options: PropTypes.object,
  children: PropTypes.node,
};

// eslint-disable-next-line import/prefer-default-export
export { BaseMap };
