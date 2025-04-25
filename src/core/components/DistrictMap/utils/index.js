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
          .map((item) => ({ name: item[location], value: Number(item[value]) }))
      : filteredData.map((item) => ({ name: item[location], value: value ? Number(item[value]) : 1 }));
  if (indicator.aggregator) {
    return aggregateValues(filteredData, indicator.aggregator);
  }

  return filteredData;
};

const processCoordinates = (data) => {
  const coordinates = data.split(',');

  return coordinates.map((item) => parseFloat(item));
};

const MASINDI_EXCLUDE_LIST = ['Waiga Primary School', 'Gods Mercy Primary School', 'Bukeeka COU Primary School'];
const KAYUNGA_EXCLUDE_LIST = [
  'Bukeeka COU Primary School',
  'Kungu CU Primary School',
  'King Jesus Nursery And Primary School',
  'Nile View Primary School',
  'Imam Hassan Primary School Maligita',
  'Bright Future Nursery And Primary School Kangulumira',
];

export function getSchoolEnrollmentUrl(enrollmentConfig, level) {
  return enrollmentConfig.find((item) => item.id.includes(level.toLowerCase()));
}

function parseEnrollmentData(enrollmentData, feature, mapping) {
  const boysEntry = enrollmentData.find(
    (item) =>
      item[mapping.gender] === 'Boys' &&
      item[mapping.year] === feature.year &&
      compareStringsIgnoreCase(item.school_name, feature.school_name),
  );
  const girlsEntry = enrollmentData.find(
    (item) =>
      item[mapping.gender] === 'Girls' &&
      item[mapping.year] === feature.year &&
      compareStringsIgnoreCase(item.school_name, feature.school_name),
  );

  return {
    boys: (boysEntry && parseInt(boysEntry[mapping.total], 10)) || 'No Data',
    girls: (girlsEntry && parseInt(girlsEntry[mapping.total], 10)) || 'No Data',
  };
}

export const getSchoolMarkers = (district, schoolSpecs, dataUrl, dataID, baseAPIUrl, enrollmentUrl, mapping) => {
  const finalGeoJSON = {
    type: 'FeatureCollection',
    features: [],
  };
  const dataVariable = dataUrl || (dataID && baseAPIUrl);
  if (!schoolSpecs || !dataVariable) return finalGeoJSON;
  if (dataUrl || (dataID && baseAPIUrl)) {
    const dataFetchPromise = dataUrl ? fetchData(dataUrl) : fetchDataFromAPI(dataID, baseAPIUrl);
    const fetchSchoolEnrollmentPromise = fetchData(enrollmentUrl);

    Promise.all([dataFetchPromise, fetchSchoolEnrollmentPromise])
      .then(([data, schoolEnrollment]) => {
        const filteredData = data.filter((row) =>
          district === 'Masindi'
            ? !MASINDI_EXCLUDE_LIST.includes(row.school_name)
            : !KAYUNGA_EXCLUDE_LIST.includes(row.school_name),
        );
        if (schoolSpecs.ownership === 'all') {
          const excludeEnrollmentData = schoolEnrollment.filter((row) =>
            district === 'Masindi'
              ? !MASINDI_EXCLUDE_LIST.includes(row.school_name)
              : !KAYUNGA_EXCLUDE_LIST.includes(row.school_name),
          );

          filteredData
            .filter((d) => d.level === schoolSpecs.level)
            .forEach((item) => {
              if (item.gps_coordinates) {
                const itemCoordinates = processCoordinates(item.gps_coordinates);

                if (itemCoordinates) {
                  const enrollment = parseEnrollmentData(excludeEnrollmentData, item, mapping);

                  finalGeoJSON.features.push({
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [itemCoordinates[1], itemCoordinates[0]],
                    },
                    properties: {
                      level: item.level,
                      ownership: item.ownership,
                      name: item.school_name,
                      parish: item.parish,
                      enrollment,
                    },
                  });
                }
              }
            });
        } else {
          filteredData
            .filter((d) => d.level === schoolSpecs.level && d.ownership === schoolSpecs.ownership)
            .forEach((item) => {
              if (item.gps_coordinates) {
                const itemCoordinates = processCoordinates(item.gps_coordinates);

                if (itemCoordinates) {
                  const filteredEnrollment = schoolEnrollment.filter((d) => d.school_name === item.school_name);

                  finalGeoJSON.features.push({
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [itemCoordinates[1], itemCoordinates[0]],
                    },
                    properties: {
                      level: item.level,
                      ownership: item.ownership,
                      name: item.school_name,
                      parish: item.parish,
                      enrollment: parseEnrollmentData(filteredEnrollment, item, mapping),
                    },
                  });
                }
              }
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return finalGeoJSON;
  }

  return finalGeoJSON;
};

export const getHealthMarkers = (dataUrl, dataID, baseAPIUrl, mapping) => {
  const finalGeoJSON = {
    type: 'FeatureCollection',
    features: [],
  };
  const dataVariable = dataUrl || (dataID && baseAPIUrl);
  if (!dataVariable) return finalGeoJSON;
  if (dataUrl || (dataID && baseAPIUrl)) {
    const dataFetchPromise = dataUrl ? fetchData(dataUrl) : fetchDataFromAPI(dataID, baseAPIUrl);

    dataFetchPromise
      .then((data) => {
        data.forEach((item) => {
          if (item[mapping.latitude] && item[mapping.longitude]) {
            const itemCoordinates = [parseFloat(item[mapping.longitude]), parseFloat(item[mapping.latitude])];
            if (itemCoordinates) {
              finalGeoJSON.features.push({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: itemCoordinates,
                },
                properties: {
                  ownership: item['Facility Ownership'],
                  name: item['Subcounty/Towncouncil'],
                  parish: item['Parish Name/ Ward'],
                },
              });
            }
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

export const getMarkers = (district, schoolSpecs, options, baseAPIUrl) => {
  if (options.topic.includes('education')) {
    const { schoolLocationdataID: dataID, schoolLocationUrl: dataUrl, enrollmentUrl, mapping } = options.indicator;

    return getSchoolMarkers(district, schoolSpecs, dataUrl, dataID, baseAPIUrl, enrollmentUrl, mapping);
  }
  if (options.topic.includes('health')) {
    const { url: dataUrl, mapping } = options.indicator;

    return getHealthMarkers(dataUrl, '', baseAPIUrl, mapping);
  }

  return {
    type: 'FeatureCollection',
    features: [],
  };
};

export function schoolLevel(indicator) {
  if (indicator === 'numberOfPrimarySchools') {
    return { level: 'Primary', ownership: 'all' };
  }
  if (indicator === 'numberOfSecondarySchools') {
    return { level: 'Secondary', ownership: 'all' };
  }
  if (indicator === 'numberOfGovernmentPrimarySchools') {
    return { level: 'Primary', ownership: 'Government' };
  }
  if (indicator === 'numberOfPrivatePrimarySchools') {
    return { level: 'Primary', ownership: 'Private' };
  }
  if (indicator === 'numberOfGovernmentSecondarySchools') {
    return { level: 'Secondary', ownership: 'Government' };
  }
  if (indicator === 'numberOfPrivateSecondarySchools') {
    return { level: 'Secondary', ownership: 'Private' };
  }

  return '';
}
