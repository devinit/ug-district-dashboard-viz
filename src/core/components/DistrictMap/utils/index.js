import { groupBy } from 'lodash';
import { flyToLocation, getProperLocationName } from '../../../../components/BaseMap/utils';
import { filterData } from '../../../utils';
import fetchData, { fetchDataFromAPI } from '../../../../utils/data';
import { compareStringsIgnoreCase } from '../../../../utils';

export const COLOURED_LAYER = 'highlight';
export const coreLayer = {
  type: 'shapefile',
  style: 'mapbox://styles/edwinmp/ck42rrx240t8p1cqpkhgy2g0m/draft',
  sourceLayer: 'Uganda_Sub-Counties_2019-8w0zb5',
  layerName: 'uganda-Sub-counties-2019-8w0zb5',
  center: [32.655221, 1.344666],
  zoom: 8,
  minZoom: 8.5,
  maxZoom: 14,
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
  const groupedData = groupBy(data, (item) => {
    const formatTownCouncilString = item.name && item.name.replace(/Towncouncil/g, 'Town Council');
    // Remove "Subcounty" and "subcounty" from the name case insensitively
    const removeSubcountyString = formatTownCouncilString && formatTownCouncilString.replace(/subcounty/gi, '').trim();

    return removeSubcountyString;
  });

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
  filteredData =
    year && yearField
      ? filteredData
          .filter((item) => `${item[yearField]}` === `${year}`)
          .map((item) => ({ name: item[location], value: value ? Number(item[value]) : 1 }))
      : filteredData.map((item) => ({ name: item[location], value: value ? Number(item[value]) : 1 }));
  if (indicator.aggregator) {
    return aggregateValues(filteredData, indicator.aggregator);
  }

  return filteredData;
};

const processCoordinates = (item, mapping) => {

  const data = item[mapping.coordinates];
  if (!data && (!item[mapping.longitude] || !item[mapping.latitude])) return null;
  const coordinates = data ? data.split(',') : [item[mapping.longitude], item[mapping.latitude]];

  return coordinates.map((coordinate) => parseFloat(coordinate));
};

/* function formatImgTag(url) {

  try {
    const urlObj = new URL(url);
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') return `<img src="${url}" alt="" width="50" height="60">`;

    return url;
  } catch (err) {

    return url;
  }
} */

function otherDetailsData(otherData, feature, mapping, otherDetailsFilters, mappingFilters, markerPopupData) {

  const mappingFilter = (item) => {
    const filterKeys = Object.keys(mappingFilters);

    return filterKeys.filter((currentValue) => Number(item[currentValue]) === Number(feature[mappingFilters[currentValue]]) );
  };
  const entries = {};
  const otherDetailsKeys = Object.keys(otherDetailsFilters);
  otherDetailsKeys.forEach((key) => {
    entries[key] = otherData.find(
        (item) =>
          key === item[otherDetailsFilters[key]] &&
          mappingFilter(item) &&
          compareStringsIgnoreCase(item[mapping.joiningColumn], feature[mapping.joiningColumn])
      );
  });

  const counts = {};
  const popupHtml = [];
  otherDetailsKeys.forEach((key) => {
    counts[key] = entries[key] ? parseInt(entries[key][mapping.total], 10) : 0;
    popupHtml.push(`<p>${markerPopupData[key]} ${counts[key]}</p>`);
  });


  const totalCount = otherDetailsKeys.reduce((total, curr) => {
    const parsed = counts[curr] ? counts[curr] : parseInt(counts[curr], 10);

    return total + parsed;
  }, 0);

  return `
    ${popupHtml.join('')}
    <p>${mapping.totalLabel} ${ !Number.isNaN(totalCount) ? totalCount : 'No Data'}</p>
  `;
}

export const getMarkersFromMultipleFiles = (indicatorSpecs, locationDataUrl, locationDataId, baseAPIUrl, otherDetailsUrl, otherDetailsDataId, year, mapping, properties, otherDetailsFilters, mappingFilters, markerPopupData) => {
  const { year: yearField } = mapping;
  const finalGeoJSON = {
    type: 'FeatureCollection',
    features: [],
  };
  const dataVariable = locationDataUrl || (locationDataId && baseAPIUrl);
  if (!indicatorSpecs || !dataVariable) return finalGeoJSON;
  if (locationDataUrl || (locationDataId && baseAPIUrl)) {
    const dataFetchPromise = locationDataUrl ? fetchData(locationDataUrl) : fetchDataFromAPI(locationDataId, baseAPIUrl);
    const otherDetailsPromise = otherDetailsUrl ? fetchData(otherDetailsUrl) : fetchDataFromAPI(otherDetailsDataId, baseAPIUrl);;
    const propertiesKeys = properties ? Object.keys(properties) : [];

    Promise.all([dataFetchPromise, otherDetailsPromise])
      .then(([data, otherDetails]) => {

        data
          .filter((d) => indicatorSpecs.ownership === 'all' ? d.level === indicatorSpecs.level : d.level === indicatorSpecs.level && d.ownership === indicatorSpecs.ownership)
          .forEach((item) => {
            const itemCoordinates = processCoordinates(item, mapping);
            if (itemCoordinates) {
              const filteredDetails = otherDetails.filter((d) =>
                year && yearField ?
                d[mapping.joiningColumn] === item[mapping.joiningColumn] && Number(d[yearField]) === year :
                d[mapping.joiningColumn] === item[mapping.joiningColumn]
              );
              const markerPopupHtml = otherDetailsData(filteredDetails, item, mapping, otherDetailsFilters, mappingFilters, markerPopupData);
              const propertiesData = Object.fromEntries(propertiesKeys.map((k) => [k, item[properties[k]]]));

              finalGeoJSON.features.push({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [itemCoordinates[1], itemCoordinates[0]],
                },
                properties: {
                  ...propertiesData,
                  markerPopupData: markerPopupHtml,
                },
              });
            }
          });

      })
      .catch((error) => {
        console.log(error);
      });

    return finalGeoJSON;
  }

  return finalGeoJSON;
};

function getMarkerPopupText(labels, markerPopupData, item) {
  const mappedData = labels.map((label) => `<p>${label}: ${item[markerPopupData[label]]}</p>`);

  return mappedData.join("");
}

export const getMarkersFromOneFile = (dataUrl, dataID, baseAPIUrl, mapping, markerPopupData, properties) => {
  const finalGeoJSON = {
    type: 'FeatureCollection',
    features: [],
  };
  const dataVariable = dataUrl || (dataID && baseAPIUrl);
  if (!dataVariable) return finalGeoJSON;
  if (dataUrl || (dataID && baseAPIUrl)) {
    const markerPopupLabels = markerPopupData ? Object.keys(markerPopupData) : [];
    const propertiesKeys = properties ? Object.keys(properties) : [];
    const dataFetchPromise = dataUrl ? fetchData(dataUrl) : fetchDataFromAPI(dataID, baseAPIUrl);

    dataFetchPromise
      .then((data) => {
        data.forEach((item) => {
          const itemCoordinates = processCoordinates(item, mapping);
          if (itemCoordinates) {
            const propertiesData = Object.fromEntries(propertiesKeys.map((k) => [k, item[properties[k]]]));
            finalGeoJSON.features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: itemCoordinates,
              },
              properties: {
                ...propertiesData,
                markerPopupData: getMarkerPopupText(
                  markerPopupLabels,
                  markerPopupData,
                  item,
                ),
              },
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return finalGeoJSON;
  }

  return finalGeoJSON;
};

export const getMarkers = (indicatorSpecs, options, baseAPIUrl) => {
  const { url, dataID, locationDataId, locationDataUrl, otherDetailsUrl, otherDetailsDataId, mapping, markerPopupData, properties, otherDetailsFilters, mappingFilters } = options.indicator;
  const { year } = options;
  if (locationDataUrl || otherDetailsUrl || locationDataId || otherDetailsDataId) {

    return getMarkersFromMultipleFiles(indicatorSpecs, locationDataUrl, locationDataId, baseAPIUrl, otherDetailsUrl, otherDetailsDataId, year, mapping, properties, otherDetailsFilters, mappingFilters, markerPopupData);
  }
  if (url || dataID) {

    return getMarkersFromOneFile(url, dataID, baseAPIUrl, mapping, markerPopupData, properties);
  }

  return {
    type: 'FeatureCollection',
    features: [],
  };
};
