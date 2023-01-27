import { Popup } from 'mapbox-gl';
import { useEffect, useState, useCallback } from 'react';
import { COLOURED_LAYER, renderTooltipFromEvent, setZoomByContainerWidth } from '../../../components/BaseMap/utils';
import fetchData from '../../../utils/data';
import { processData } from '../DistrictMap/utils';

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
      map.off('mousemove', COLOURED_LAYER, onHover);
      // add even listeners to show tooltip
      map.on('mousemove', COLOURED_LAYER, onHover);
      map.on('mouseleave', COLOURED_LAYER, onBlur);
    }
  }, [map, location, options, data]);
  useEffect(() => {
    const fetchIndicatorData = async (url) => {
      const indicatorData = await fetchData(url);
      setData(processData(indicatorData, options.indicator, options.year));
    };
    if (options.indicator && options.year) {
      fetchIndicatorData(options.indicator.url);
    }
  }, [options.indicator, options.year]);

  return { map, data, setData, setMap, setOptions };
};

export default useMap;
