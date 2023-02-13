import PropTypes from 'prop-types';

const BaseMapLayer = ({ map, show, onAdd, ...options }) => {
  if (map) {
    if (map.getLayer(options.id)) {
      map.removeLayer(options.id);
    }
    if (show) {
      map.addLayer(options);
      if (onAdd) {
        onAdd(map, options.id);
      }
    }
  }

  return null;
};

BaseMapLayer.defaultProps = { show: true };
BaseMapLayer.propTypes = {
  map: PropTypes.object,
  show: PropTypes.bool,
  onAdd: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { BaseMapLayer };
