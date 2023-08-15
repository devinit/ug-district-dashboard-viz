/** @jsx jsx */
import { css, Global, jsx } from '@emotion/react';
import mapbox from 'mapbox-gl';
import PropTypes from 'prop-types';
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { BaseMapLayer } from './BaseMapLayer';

const myGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [31.71, 1.699],
      },
      properties: {
        title: 'Mapbox',
        description: 'Kijura town',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [31.714, 1.692],
        // coordinates: [32.655221, 1.344666],
      },
      properties: {
        title: 'Mapbox',
        description: 'Masindi hotel',
      },
    },
  ],
};
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
        myGeojson.features.forEach((feature) => {
          // create a HTML element for each feature
          const el = document.createElement('div');
          el.className = 'marker';

          // make a marker for each feature and add to the map
          // const firstProjection =
          //   'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
          // const secondProjection =
          //   '+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs';
          // console.log(proj4('EPSG:3857', 'secondProjection', feature.geometry.coordinates));
          new mapbox.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
        });
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
