import { Popup } from 'mapbox-gl';
import { useEffect, useState, useCallback } from 'react';
import { COLOURED_LAYER, renderTooltipFromEvent, setZoomByContainerWidth } from '../../../components/BaseMap/utils';
import fetchData, { fetchDataFromAPI } from '../../../utils/data';
import { processData, getSchoolMarkers, schoolLevel } from '../DistrictMap/utils';

const showPopup = (popup, map, event, options) => {
  renderTooltipFromEvent(map, event, { ...options, popup });
};

const popup = new Popup({ offset: 5 });
const markerPopup = new Popup({ offset: 5 });

const useMap = (location, layer, baseAPIUrl, defaultOptions = {}) => {
  const [map, setMap] = useState();
  const [options, setOptions] = useState(defaultOptions); // Popup options
  const [data, setData] = useState([]);
  const [locationData, setLocationData] = useState();
  const [level, setLevel] = useState('');

  const onHover = useCallback(
    (event) => {
      const canvas = map.getCanvas();
      canvas.style.cursor = 'pointer';
      showPopup(popup, map, event, { ...layer, data, ...options });
    },
    [map, data, options]
  );

  const onBlur = useCallback(() => {
    const canvas = map.getCanvas();
    canvas.style.cursor = '';
    popup.remove();
  }, [map, location]);

  const handleMarkerMove = useCallback(
    (e) => {
      e.preventDefault();
      map.off('mousemove', COLOURED_LAYER, onHover);
      popup.remove();
      if (e.features.length) {
        map.setLayoutProperty('points', 'icon-size', [
          'match',
          ['get', 'name'],
          e.features[0].properties.name,
          0.4,
          0.2
        ]);
      }
    },
    [map, locationData]
  );

  const onMarkerClick = useCallback((e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const { name, parish, ownership } = e.features[0].properties;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    markerPopup
      .setLngLat(coordinates)
      .setHTML(
        `
      <div style="white-space: nowrap;">
        <div style="font-size:1.6rem;padding-bottom:5px;font-weight:700;text-align:center;text-transform:capitalize;">
          ${name}
        </div>
        <p>Coordinates: ${coordinates}</p>
        <p>Ownership: ${ownership}</p>
        <p>Parish: ${parish || 'No parish data'}</p>
      </div>
    `
      )
      .addTo(map);
  });

  const handleMarkerLeave = useCallback(() => {
    map.on('mousemove', COLOURED_LAYER, onHover);
    popup.remove();
    map.setLayoutProperty('points', 'icon-size', 0.2);
  }, [map, location]);

  const onZoomend = useCallback(() => {
    const currentZoom = map.getZoom();
    if (currentZoom < 10) {
      map.flyTo({ center: location.coordinates, duration: 3000 });
    }
  }, [map, location]);

  useEffect(() => {
    if (map) {
      if (map.getLayer('clusters')) {
        map.removeLayer('clusters');
      }
      if (map.getLayer('cluster-count')) {
        map.removeLayer('cluster-count');
      }
      if (map.getLayer('unclustered-point')) {
        map.removeLayer('unclustered-point');
      }
      if (locationData) {
        map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
          if (error) throw error;
          if (!map.hasImage('custom-marker')) map.addImage('custom-marker', image, { sdf: true });
          if (!map.getSource('points'))
            map.addSource('points', {
              type: 'geojson',
              data: locationData,
              generateId: true,
              cluster: true,
              clusterMaxZoom: 11,
              clusterRadius: 50
            });

          if (!map.getLayer('clusters')) {
            map.addLayer({
              id: 'clusters',
              type: 'circle',
              source: 'points',
              filter: ['has', 'point_count'],
              paint: {
                'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
                'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
              }
            });
          }

          if (!map.getLayer('cluster-count')) {
            map.addLayer({
              id: 'cluster-count',
              type: 'symbol',
              source: 'points',
              filter: ['has', 'point_count'],
              layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
              }
            });
          }

          if (!map.getLayer('unclustered-point')) {
            map.addLayer({
              id: 'unclustered-point',
              type: 'symbol',
              source: 'points',
              filter: ['!', ['has', 'point_count']],
              paint: {
                'icon-color': ['match', ['get', 'level'], 'Primary', '#ff9c1a', 'Secondary', '#00b3b3', '#ffffff']
              },
              layout: {
                'icon-image': 'custom-marker',
                'icon-anchor': 'bottom',
                'icon-size': 0.3,
                'icon-allow-overlap': true
              },
              minzoom: 8.5
            });
          }

          // inspect a cluster on click
          map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('points').getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom
              });
            });
          });

          // When a click event occurs on a feature in
          // the unclustered-point layer, open a popup at
          // the location of the feature, with
          // description HTML from its properties.
          map.on('click', 'unclustered-point', onMarkerClick);

          map.on('zoomend', onZoomend);

          map.getSource('points').setData(locationData);
        });
      }
    }
  }, [map, data, locationData, level]);

  useEffect(() => {
    if (map) {
      // hide secondary layers
      map.getStyle().layers.forEach((_layer) => {
        if (!['background', 'highlight'].includes(_layer.id)) {
          map.setLayoutProperty(_layer.id, 'visibility', 'none');
        }
      });
      setZoomByContainerWidth(map, map.getContainer(), layer);
      // remove any existing listners
      map.off('mousemove', 'points', handleMarkerMove);
      map.off('mouseleave', COLOURED_LAYER, onBlur);
      map.off('mouseover', COLOURED_LAYER, onHover);
      map.off('click', 'points', onMarkerClick);
      // add even listeners to show tooltip

      map.on('mousemove', COLOURED_LAYER, onHover);
      map.on('mouseleave', COLOURED_LAYER, onBlur);
      map.on('mousemove', 'points', handleMarkerMove);
      map.on('mouseleave', 'points', handleMarkerLeave);
      map.on('click', 'points', onMarkerClick);
    }
  }, [map, location, options, data]);

  useEffect(() => {
    const fetchIndicatorData = async (url, dataID) => {
      if (url || (dataID && baseAPIUrl)) {
        const dataFetchPromise = url ? fetchData(url) : fetchDataFromAPI(dataID, baseAPIUrl);
        const indicatorData = await dataFetchPromise;
        setData(processData(indicatorData, options.indicator, options.year));
      }
    };
    if (options.indicator && options.year) {
      setLevel(schoolLevel(options.indicator.id));
      setLocationData(
        getSchoolMarkers(
          location.name,
          schoolLevel(options.indicator.id),
          options.indicator.schoolLocationUrl,
          options.indicator.schoolLocationdataID,
          baseAPIUrl
        )
      );
      fetchIndicatorData(options.indicator.url, options.indicator.dataID);
    }
  }, [options.indicator, options.year]);

  return { map, data, setData, setMap, setOptions };
};

export default useMap;
