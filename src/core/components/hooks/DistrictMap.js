import { Popup } from 'mapbox-gl';
import { useEffect, useState, useCallback} from 'react';
import { COLOURED_LAYER, renderTooltipFromEvent, setZoomByContainerWidth } from '../../../components/BaseMap/utils';
import fetchData from '../../../utils/data';
import { processData, getSchoolMarkers } from '../DistrictMap/utils';

const showPopup = (popup, map, event, options) => {
  renderTooltipFromEvent(map, event, { ...options, popup });
};

const popup = new Popup({ offset: 5 });
const markerPopup = new Popup({offset: 5});

const useMap = (location, layer, defaultOptions = {}) => {
  const [map, setMap] = useState();
  const [options, setOptions] = useState(defaultOptions);
  const [data, setData] = useState([]);
  const [locationData, setLocationData] = useState()

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

  const handleMarkerMove = useCallback((e) => {
    e.preventDefault()
    map.off('mousemove',COLOURED_LAYER,onHover)
    popup.remove()
    if (e.features.length > 0) {
      map.setFeatureState({
        source: 'points',
        id: e.features[0].id
        }, {
          hover: true
        });
    }

  }, [map, locationData])

  const onMarkerClick = useCallback((e) => {
    const coordinates = e.features[0].geometry.coordinates.slice()
    const {name, parish,ownership} = e.features[0].properties

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

    markerPopup.setLngLat(coordinates).setHTML(`
    <div style="white-space: nowrap;">
      <div style="font-size:1.6rem;padding-bottom:5px;font-weight:700;text-align:center;text-transform:capitalize;">
        ${name}
      </div>
      <p>Coordinates: ${coordinates}</p>
      <p>Ownership: ${ownership}</p>
      <p>Parish: ${parish}</p>
    </div>
    `).addTo(map)
  })

  const handleMarkerLeave = useCallback(() => {
    map.on('mousemove',COLOURED_LAYER,onHover)
    popup.remove()
  }, [map, location])

  useEffect(() => {
    if (map) {
      if(map.getLayer('points')){
        map.removeLayer('points')
      }
      if (locationData) {
        map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
          if (error) throw error;
          if (!map.hasImage('custom-marker')) map.addImage('custom-marker', image, {sdf: true});
          if (!map.getSource('points')) map.addSource('points', {
            type: 'geojson',
            data: locationData,
            'generateId': true
          });

          if(!map.getLayer('points')) map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'custom-marker',
              'icon-anchor': 'bottom',
              'icon-size': 0.3,
            },
            paint: {
              'icon-color': [
                'match',
                ['get', 'level'],
                'Primary',
                '#4287f5',
                'Secondary',
                '#5416f2',
                'Nursery',
                '#17cf26',
                'Tertiary',
                '#f27916',
                '#FF0000'
              ]
            },
            minzoom: 8,
          });

        });
      }
    }
  }, [map, data]);

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
      map.off('mousemove', 'points', handleMarkerMove)
      map.off('mouseleave', COLOURED_LAYER, onBlur);
      map.off('mouseover', COLOURED_LAYER, onHover);
      map.off('click', 'points', onMarkerClick)
      // add even listeners to show tooltip

      map.on('mousemove', COLOURED_LAYER, onHover);
      map.on('mouseleave', COLOURED_LAYER, onBlur);
      map.on('mousemove', 'points', handleMarkerMove)
      map.on('mouseleave', 'points', handleMarkerLeave)
      map.on('click', 'points', onMarkerClick)
      }
  }, [map, location, options, data,]);

  useEffect(() => {
    const fetchIndicatorData = async (url) => {
      const indicatorData = await fetchData(url);
      setData(processData(indicatorData, options.indicator, options.year));
    };
    if (options.indicator && options.year) {
      setLocationData(getSchoolMarkers(location.name))
      fetchIndicatorData(options.indicator.url);
    }
  }, [options.indicator, options.year]);

  return { map, data, setData, setMap, setOptions };
};

export default useMap;
