import { Popup } from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { COLOURED_LAYER, renderTooltipFromEvent, setZoomByContainerWidth } from '../../../components/BaseMap/utils';

const showPopup = (popup, map, event, options) => {
  renderTooltipFromEvent(map, event, { ...options, popup });
};

const useMap = (location, layer, data, defaultOptions = {}) => {
  const [map, setMap] = useState();
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    if (map) {
      // hide secondary layers
      map.getStyle().layers.forEach((_layer) => {
        if (!['background', 'highlight'].includes(_layer.id)) {
          map.setLayoutProperty(_layer.id, 'visibility', 'none');
        }
      });
      setZoomByContainerWidth(map, map.getContainer(), layer);
      // add tooltip
      const popup = new Popup({ offset: 5 });
      const canvas = map.getCanvas();
      const onHover = (event) => {
        canvas.style.cursor = 'pointer';
        showPopup(popup, map, event, { ...layer, data, ...options });
      };
      const onBlur = () => {
        canvas.style.cursor = '';
        if (!location) {
          popup.remove();
        }
      };

      map.on('mousemove', COLOURED_LAYER, onHover);
      map.on('mouseleave', COLOURED_LAYER, onBlur);
    }
  }, [map, location]);

  return { map, setMap, setOptions };
};

export default useMap;
