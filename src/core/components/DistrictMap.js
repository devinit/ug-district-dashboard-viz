/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { BaseMap, BaseMapLayer } from '../../components/BaseMap';
import { setZoomByContainerWidth } from '../../components/BaseMap/utils';
import useMap from './hooks/DistrictMap';

export const COLOURED_LAYER = 'highlight';
const coreLayer = {
  type: 'shapefile',
  style: 'mapbox://styles/edwinmp/ck42rrx240t8p1cqpkhgy2g0m',
  sourceLayer: 'uga_admbnda_adm3_ubos_v5-9li2ca',
  layerName: 'uga-admbnda-adm3-ubos-v5-9li2ca',
  center: [32.655221, 1.344666],
  zoom: 8,
  minZoom: 8,
  maxZoom: 8.5,
  nameProperty: 'ADM3_EN', // 'ADM1_EN',
  codeProperty: 'ADM3_PCODE',
  // eslint-disable-next-line no-unused-vars
  formatter: (value, target = 'map') => value.toUpperCase(),
};
const renderLayers = (loading, data) => {
  const hiddenLayers = [coreLayer].map((layer, index) => (
    <BaseMapLayer
      key={`${COLOURED_LAYER}-${index}`}
      id={layer.layerName}
      source="composite"
      source-layer={layer.sourceLayer}
      show={false}
    />
  ));

  if (!loading && data.length) {
    return hiddenLayers.concat(
      <BaseMapLayer
        key={COLOURED_LAYER}
        id={COLOURED_LAYER}
        source="composite"
        source-layer={'uganda_districts_2019_i-9qg3nj'}
        // maxzoom={options.maxZoom && options.maxZoom + 1}
        type="fill"
        paint={{
          'fill-color': {
            property: coreLayer.nameProperty,
            type: 'categorical',
            default: '#D1CBCF',
            // stops: getLocationStyles(locationData, range, colours, options.formatter),
          },
          'fill-opacity': 0.75,
          'fill-outline-color': '#ffffff',
        }}
        // onAdd={onAddLayer}
      />
    );
  }

  return hiddenLayers.concat(
    <BaseMapLayer
      key={COLOURED_LAYER}
      id={COLOURED_LAYER}
      source="composite"
      source-layer={coreLayer.sourceLayer}
      //   maxzoom={options.maxZoom && options.maxZoom + 1}
      type="fill"
      paint={{
        'fill-color': '#D1CBCF',
        'fill-opacity': 0.75,
        'fill-outline-color': '#ffffff',
      }}
      //   onAdd={onAddLayer}
    />
  );
};

const DistrictMap = (props) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(undefined);
  useMap(map, '', coreLayer);

  useEffect(() => {
    if (map) {
      setZoomByContainerWidth(map, map.getContainer(), coreLayer);
    }
  }, [map]);

  const onLoad = (_map) => {
    setLoading(false);
    setMap(_map);
  };

  return (
    <div className="spotlight">
      <div className="spotlight__aside spotlight__aside--no-margin" css={{ minHeight: '500px' }}>
        Sidebar Goes Here
      </div>
      <div className="spotlight__main spotlight__main--map">
        {loading ? <div>Loading ...</div> : null}
        <BaseMap
          accessToken="pk.eyJ1IjoiZWR3aW5tcCIsImEiOiJjazFsdHVtcG0wOG9mM2RueWJscHhmcXZqIn0.cDR43UvfMaOY9cNJsEKsvg"
          options={{
            style: coreLayer.style,
            center: coreLayer.center,
            minZoom: coreLayer.minZoom || 6,
            zoom: coreLayer.zoom || 6.1,
            maxZoom: coreLayer.maxZoom || 7,
            scrollZoom: false,
          }}
          style={{ width: '100%', background: '#ffffff' }}
          onLoad={onLoad}
        >
          {renderLayers(loading, props.data)}
        </BaseMap>
      </div>
    </div>
  );
};

DistrictMap.defaultProps = {
  data: [],
};

DistrictMap.propTypes = {
  configs: PropTypes.object,
  data: PropTypes.array,
  location: PropTypes.shape({
    name: PropTypes.string,
    fullName: PropTypes.string,
  }),
};

export default DistrictMap;
