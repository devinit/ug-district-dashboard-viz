import { flyToLocation, getProperLocationName } from '../../../../components/BaseMap/utils';

export const COLOURED_LAYER = 'highlight';
export const coreLayer = {
  type: 'shapefile',
  style: 'mapbox://styles/edwinmp/ck42rrx240t8p1cqpkhgy2g0m/draft',
  sourceLayer: 'Uganda_Sub-Counties_2019-8w0zb5',
  layerName: 'uganda-Sub-counties-2019-8w0zb5',
  center: [32.655221, 1.344666],
  zoom: 8,
  minZoom: 8,
  maxZoom: 9,
  districtNameProperty: 'District',
  nameProperty: 'Subcounty', // 'ADM1_EN',
  codeProperty: 'scode2019',
  // eslint-disable-next-line no-unused-vars
  formatter: (Value, target = 'map') => Value.toUpperCase(),
};

export const onAddLayer = (map, layerID, location, layerConfig) => {
  if (location) {
    map.setFilter(layerID, [
      '==',
      layerConfig.nameProperty,
      getProperLocationName(location.name, layerConfig.formatter),
    ]);
    // map.setPaintProperty(layerID, 'fill-color', '#d1d1d1');
    setTimeout(() => {
      if (location.coordinates) {
        map.flyTo({ center: location.coordinates, zoom: 8.5 });
      } else {
        const locationName = layerConfig.formatter ? layerConfig.formatter(location.name) : location.name;
        flyToLocation(map, locationName, layerConfig);
      }
    }, 500);
  }
};

export const getTopicById = (topics, topic) => topics.find((_topic) => _topic.id === topic);

export const getRawFilterOptions = (topics, options) => {
  const { topic, indicator, year } = options;
  if (topic) {
    const selectedTopic = topics.find((t) => t.id === topic);
    if (selectedTopic && indicator) {
      const selectedIndicator = selectedTopic.indicators.find((i) => i.id === indicator);
      if (selectedIndicator) {
        return { topic: selectedTopic, indicator: selectedIndicator, year };
      }
    }

    return { topic: selectedTopic };
  }

  return {};
};
