import { Popup } from 'mapbox-gl';
import { useEffect } from 'react';
import { COLOURED_LAYER, renderTooltipFromEvent } from '../../../components/BaseMap/utils';

const showPopup = (popup, map, event, options) => {
  renderTooltipFromEvent(map, event, { ...options, popup });
};

const useMap = (map, location, layer, data) => {
  useEffect(() => {
    if (map) {
      const popup = new Popup({ offset: 5 });
      const canvas = map.getCanvas();
      const onHover = (event) => {
        canvas.style.cursor = 'pointer';
        showPopup(popup, map, event, { ...layer, data });
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
};

export default useMap;
