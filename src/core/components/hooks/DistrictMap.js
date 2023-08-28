import { Popup } from 'mapbox-gl';
import { useEffect, useState, useCallback} from 'react';
import { COLOURED_LAYER, renderTooltipFromEvent, setZoomByContainerWidth } from '../../../components/BaseMap/utils';
import fetchData from '../../../utils/data';
import { processData, getSchoolMarkers } from '../DistrictMap/utils';

const showPopup = (popup, map, event, options) => {
  renderTooltipFromEvent(map, event, { ...options, popup });
};

const popup = new Popup({ offset: 5 });
const useMap = (location, layer, defaultOptions = {}) => {
  const [map, setMap] = useState();
  const [options, setOptions] = useState(defaultOptions);
  const [data, setData] = useState([]);

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

  const handleMarkerMove = useCallback(() => {
    map.off('mousemove',COLOURED_LAYER,onHover)
    popup.remove()
  }, [map, location])

  const handleMarkerLeave = useCallback(() => {
    map.on('mousemove',COLOURED_LAYER,onHover)
    popup.remove()
  }, [map, location])

  useEffect(() => {
    const locationData = getSchoolMarkers(location.name)
    if (map) {
      if (locationData) {
        map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
          if (error) throw error;
          map.addImage('custom-marker', image);
          map.addSource('points', {
            type: 'geojson',
            data: locationData,
          });
          map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'custom-marker',
              'icon-size': 0.4,
            },
            minzoom: 8,
          });
        });
      }
    }
  }, [map]);

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
      // add even listeners to show tooltip

      map.on('mousemove', COLOURED_LAYER, onHover);
      map.on('mouseleave', COLOURED_LAYER, onBlur);
      map.on('mousemove', 'points', handleMarkerMove)
      map.on('mouseleave', 'points', handleMarkerLeave)
      }
  }, [map, location, options, data,]);

  useEffect(() => {
    const fetchIndicatorData = async (url) => {
      const indicatorData = await fetchData(url);
      setData(processData(indicatorData, options.indicator, options.year));
    };
    if (options.indicator && options.year) {
      // setLocationData(getSchoolMarkers(location.name))
      fetchIndicatorData(options.indicator.url);
    }
  }, [options.indicator, options.year]);

  return { map, data, setData, setMap, setOptions };
};

export default useMap;
