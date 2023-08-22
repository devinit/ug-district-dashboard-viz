import { Popup, Marker } from 'mapbox-gl';
import { useEffect, useState, useCallback } from 'react';
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
  const [locationData, setLocationData] = useState([]);

  const onHover = useCallback(
    (event) => {
      // const markers = document.getElementsByClassName('marker')
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
      map.off('mouseleave', COLOURED_LAYER, onBlur);
      map.off('mouseover', COLOURED_LAYER, onHover);
      // add even listeners to show tooltip
      map.on('mouseover', COLOURED_LAYER, onHover);
      map.on('mouseleave', COLOURED_LAYER, onBlur);

      if (locationData.features) {
        locationData.features.forEach((feature) => {
          // create a HTML element for each feature
          const el = document.createElement('div');
          if (feature.properties.level === 'Primary') {
            el.className = 'marker marker-blue';
          } else {
            el.className = 'marker marker-green';
          }
          el.addEventListener('mouseover', () => {
            console.log('herer')
            if (popup.isOpen()){
              popup.remove()
            }
          })
          new Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);


        });}
    }
  }, [map, location, options, data, locationData]);
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
