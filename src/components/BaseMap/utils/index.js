import centerOfMass from '@turf/center-of-mass';
import { polygon } from '@turf/helpers';
import { LngLat } from 'mapbox-gl';

const formatNumber = (value, decimals = 1) => {
  if (value >= 1000000000000) {
    return `${(value / 1000000000000).toFixed(decimals)}tn`;
  }
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(decimals)}bn`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}m`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)}k`;
  }
  if (value >= 0) {
    return `${value.toFixed(decimals)}`;
  }
  if (value <= -1000000000000) {
    return `${(value / 1000000000000).toFixed(decimals)}tn`;
  }
  if (value <= -1000000000) {
    return `${(value / 1000000000).toFixed(decimals)}bn`;
  }
  if (value <= -1000000) {
    return `${(value / 1000000).toFixed(decimals)}m`;
  }
  if (value <= 1000) {
    return `${(value / 1000).toFixed(decimals)}k`;
  }

  return `${value.toFixed(decimals)}`;
};

export const COLOURED_LAYER = 'highlight';

export const setZoomByContainerWidth = (map, container, options) => {
  if (container.clientWidth < 700) {
    map.setZoom(options.zoom ? options.zoom - 1 : 5);
  } else if (container.clientWidth < 900) {
    map.setZoom(options.minZoom ? options.minZoom + 0.8 : 5.8);
  } else {
    map.setZoom(options.zoom || 6.1);
  }
};

export const getProperLocationName = (locationName, formatter) => (formatter ? formatter(locationName) : locationName);

export const getLocationStyles = (data, range, colours, format) => {
  if (data && range && colours) {
    return data.map((location) => {
      const locationID = getProperLocationName(location.name, format);
      const matchingRange = range.find((rng) => location.value !== null && location.value <= parseFloat(rng));

      if (matchingRange) {
        return [locationID, colours[range.indexOf(matchingRange)]];
      }
      if (location.value > parseFloat(range[range.length - 1])) {
        return [locationID, colours[colours.length - 1]];
      }

      return [locationID, '#b3adad'];
    });
  }

  return [];
};

const getTooltipValue = (options, location) =>
  location && typeof location.value === 'number'
    ? `${options.dataPrefix || ''}<span style="font-size: 1em; font-weight: 700; color:#EA7600">${formatNumber(
        location.value
      )}</span>${options.dataSuffix || ''}`
    : 'No Data';

export const getLocationNameFromEvent = (event, nameProperty) => {
  if (event.features && event.features[0].properties) {
    const { geometry } = event.features[0];
    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      const locationName = event.features[0].properties[nameProperty];

      return locationName || null;
    }
  }

  return null;
};

const getLngLatFromFeature = (feature) => {
  const position = feature.geometry && feature.geometry.coordinates;

  return position ? new LngLat(position[0], position[1]) : null;
};

export const getPosition = (feature) => {
  if (Array.isArray(feature)) {
    const coordinates = feature.map((item) => {
      const center = centerOfMass(item.geometry);

      return center.geometry.coordinates;
    });
    coordinates.push(coordinates[0]);

    return getLngLatFromFeature(centerOfMass(polygon([coordinates])));
  }

  return getLngLatFromFeature(centerOfMass(feature));
};

export const getPositionFromLocationName = (map, locationName, options) => {
  const features = map.querySourceFeatures('composite', {
    sourceLayer: options.sourceLayer,
    filter: ['in', options.nameProperty, getProperLocationName(locationName, options.formatter)],
  });

  return features && features.length ? getPosition(features) : null;
};

export const flyToLocation = (map, locationName, options, recenter = true) =>
  new Promise((resolve, reject) => {
    const position = getPositionFromLocationName(map, locationName, options);
    if (position) {
      map.flyTo({
        center: position,
        zoom: 16,
      });
      resolve(position);
    } else if (recenter) {
      // reset view before next flyTo, otherwise flying to locations not currently visible shall fail
      map.flyTo({ center: options.center, zoom: options.zoom || 6.1 });
      setTimeout(() => {
        flyToLocation(map, locationName, options, false)
          .then((_position) => resolve(_position))
          .catch(reject);
      }, 500);
    } else {
      reject(new Error(`Location ${locationName} not found!`));
    }
  });

export const renderPopup = (map, popup, position, locationName, value) =>
  popup
    .setLngLat(position)
    .setHTML(
      `
        <div style="white-space: nowrap;">
          <div style="font-size:1.6rem;padding-bottom:5px;font-weight:700;text-align:center;text-transform:capitalize;">
            ${locationName.toLowerCase()}
          </div>
          ${value ? `<em style="font-size:1.4rem;">${value}</em>` : ''}
        </div>
      `
    )
    .addTo(map);

const findLocationData = (locationName, data, formatter) =>
  data.find((location) => {
    const name = formatter ? formatter(location.name) : location.name;

    return locationName.toLowerCase() === `${name}`.toLowerCase();
  });

export const renderTooltipFromEvent = (map, event, options) => {
  const { popup, nameProperty, formatter, data } = options;
  const locationName = getLocationNameFromEvent(event, nameProperty);
  if (locationName) {
    const boundaryName = formatter ? formatter(locationName, 'tooltip') : locationName;
    if (data) {
      const location = findLocationData(boundaryName, data);
      renderPopup(map, popup, event.lngLat, boundaryName, getTooltipValue(options, location));
    } else {
      renderPopup(map, popup, event.lngLat, boundaryName, '');
    }
  }
};

export const renderTooltipFromLocation = (map, locationName, config, options) => {
  const { popup, data } = options;
  const position = getPositionFromLocationName(map, locationName, config);
  if (position) {
    const location = findLocationData(locationName, data);
    renderPopup(map, popup, position, locationName, getTooltipValue(options, location));
  }
};
