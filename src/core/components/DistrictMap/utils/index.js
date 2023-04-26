import { groupBy } from 'lodash';
import { flyToLocation, getProperLocationName } from '../../../../components/BaseMap/utils';
import { filterData } from '../../../utils';

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
  formatter: (value, target = 'map') => value.toUpperCase(),
};

export const onAddLayer = (map, layerID, location, layerConfig) => {
  if (location) {
    map.setFilter(layerID, [
      '==',
      layerConfig.nameProperty,
      getProperLocationName(location.name, layerConfig.formatter),
    ]);
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

export const aggregateValues = (data, aggregate) => {
  const groupedData = groupBy(data, (item) => item.name);

  return Object.keys(groupedData).map((key) => {
    const sum = groupedData[key].reduce((partialSum, a) => partialSum + a.value, 0);
    const avg = sum / groupedData[key].length;

    return {
      name: key,
      value: aggregate === 'sum' ? sum : avg,
    };
  });
};

export const processData = (data, indicator, year) => {
  if (!indicator) return [];
  if (!indicator.mapping) {
    throw new Error(`Mapping is required for indicator ${indicator.id}`);
  }
  const { location, value, year: yearField } = indicator.mapping;

  let filteredData = filterData(data, indicator.filters);
  filteredData = year
    ? filteredData
        .filter((item) => `${item[yearField]}` === `${year}`)
        .map((item) => ({ name: item[location], value: Number(item[value]) }))
    : filteredData.map((item) => ({ name: item[location], value: Number(item[value]) }));
  if (indicator.aggregator) {
    return aggregateValues(filteredData, indicator.aggregator);
  }

  return filteredData;
};
