/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { BaseMap, BaseMapLayer } from '../../../components/BaseMap';
import { getLocationStyles } from '../../../components/BaseMap/utils';
import { DistrictMapContext } from '../../context';
import DistrictMapSidebar from '../DistrictMapSidebar';
import useMap from '../hooks/DistrictMap';
import { COLOURED_LAYER, coreLayer, getRawFilterOptions, getTopicById, onAddLayer } from './utils/index';

const renderLayers = (loading, data, location, layerConfig, mapConfig) => {
  const hiddenLayers = [layerConfig].map((layer) => (
    <BaseMapLayer
      key={`${COLOURED_LAYER}-hidden`}
      id={layer.layerName}
      source="composite"
      source-layer={layer.sourceLayer}
      show={false}
    />
  ));

  function onAddHighlightLayer(map, layerID) {
    onAddLayer(map, layerID, location, {
      ...layerConfig,
      nameProperty: layerConfig.districtNameProperty, // since we want to highlight the district at this point
    });
  }

  if (!loading && data.length) {
    return hiddenLayers.concat(
      <BaseMapLayer
        key={COLOURED_LAYER}
        id={COLOURED_LAYER}
        source="composite"
        source-layer={layerConfig.sourceLayer}
        maxzoom={layerConfig.maxZoom && layerConfig.maxZoom + 1}
        type="fill"
        paint={{
          'fill-color': {
            property: layerConfig.nameProperty,
            type: 'categorical',
            default: '#D1CBCF',
            stops: getLocationStyles(data, mapConfig.range, mapConfig.colours, layerConfig.formatter),
          },
          'fill-opacity': 0.75,
          'fill-outline-color': '#ffffff',
        }}
        onAdd={onAddHighlightLayer}
      />
    );
  }

  return hiddenLayers.concat(
    <BaseMapLayer
      key={COLOURED_LAYER}
      id={COLOURED_LAYER}
      source="composite"
      source-layer={layerConfig.sourceLayer}
      maxzoom={layerConfig.maxZoom && layerConfig.maxZoom + 1}
      type="fill"
      paint={{
        'fill-color': '#D1CBCF',
        'fill-opacity': 0.75,
        'fill-outline-color': '#ffffff',
      }}
      onAdd={onAddHighlightLayer}
    />
  );
};

const defaultFilterOptions = { topic: null, indicator: null, year: null };
const MapActionsRow = styled.div`
  position: absolute;
  top: 1.75em;
  z-index: 1;
  left: 1.4em;
`;

function mapReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filterOptions: action.merge ? { ...state.filterOptions, ...action.filterOptions } : action.filterOptions,
        activeTopic: action.activeTopic,
        activeIndicator: action.activeIndicator,
      };
    case 'SET_DATA':
      return { ...state, data: action.data };
    case 'RESET_FILTERS':
      return { ...state, filterOptions: defaultFilterOptions };
    default:
      throw new Error();
  }
}
const initialState = {
  filterOptions: defaultFilterOptions,
};

const DistrictMap = (props) => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(mapReducer, initialState);
  const { filterOptions, activeIndicator, activeTopic } = state;
  const { data, setMap, setOptions } = useMap(props.location, coreLayer);

  useEffect(() => {
    // set map options using their caption values
    if (activeIndicator) {
      const { year } = filterOptions;
      setOptions({
        dataPrefix: `${activeIndicator.name}: `,
        dataSuffix: year && ` in ${year}`,
        indicator: activeIndicator,
        year,
      });
    }
  }, [activeIndicator, filterOptions.year]);

  function onLoad(_map) {
    setLoading(false);
    setMap(_map);
  }
  const updateFilterOptions = (options, merge = true) => {
    const { topic, indicator } = getRawFilterOptions(props.configs.data, { ...filterOptions, ...options });
    dispatch({
      type: 'UPDATE_FILTERS',
      merge,
      filterOptions: options,
      activeTopic: topic,
      activeIndicator: indicator,
    });
  };
  const activeTopicOptions = getTopicById(props.configs.data, filterOptions.topic);

  const renderDashboardButton = () =>
    activeTopicOptions && activeTopicOptions.dashboardUrl ? (
      <MapActionsRow>
        <a href={activeTopicOptions.dashboardUrl} className="button button--secondary--fill">
          {activeTopicOptions.dashboardButtonCaption}
        </a>
      </MapActionsRow>
    ) : null;

  const contextValue = useMemo(() => ({
    filters: props.filters,
    topics: props.configs.data,
    filterOptions,
    updateFilterOptions,
    activeTopic,
    activeIndicator,
  }));

  return (
    <DistrictMapContext.Provider value={contextValue}>
      <div className="spotlight">
        <div className="spotlight__aside spotlight__aside--no-margin" css={{ minHeight: '600px' }}>
          <DistrictMapSidebar />
        </div>
        <div className="spotlight__main spotlight__main--map">
          {loading ? <div>Loading ...</div> : null}
          {renderDashboardButton()}
          <BaseMap
            accessToken="pk.eyJ1IjoiZWR3aW5tcCIsImEiOiJjazFsdHVtcG0wOG9mM2RueWJscHhmcXZqIn0.cDR43UvfMaOY9cNJsEKsvg"
            options={{
              style: coreLayer.style,
              center: coreLayer.center,
              minZoom: coreLayer.minZoom || 6,
              zoom: coreLayer.zoom || 6.1,
              maxZoom: coreLayer.maxZoom || 7,
              scrollZoom: false,
              ...props.configs.options,
            }}
            style={{ width: '100%', background: '#ffffff' }}
            onLoad={onLoad}
          >
            {renderLayers(
              loading,
              data,
              props.location,
              coreLayer,
              activeIndicator ? { range: activeIndicator.range, colours: activeIndicator.colours } : {}
            )}
          </BaseMap>
        </div>
      </div>
    </DistrictMapContext.Provider>
  );
};

DistrictMap.defaultProps = {
  data: [],
};

DistrictMap.propTypes = {
  configs: PropTypes.object,
  filters: PropTypes.object,
  data: PropTypes.array,
  location: PropTypes.shape({
    name: PropTypes.string,
    fullName: PropTypes.string,
    coordinates: PropTypes.array,
  }),
};

export default DistrictMap;
