import React from 'react';
import { createRoot } from 'react-dom/client';
import { BaseMap, BaseMapLayer } from '../components/BaseMap';
import NoDataCentered from './components/NoDataCentered';

export const COLOURED_LAYER = 'highlight';
const layers = [
  {
    type: 'shapefile',
    style: 'mapbox://styles/edwinmp/ck6an0ra90nob1ikvysfmbg15',
    sourceLayer: 'uganda_districts_2019_i-9qg3nj',
    layerName: 'uganda-districts-2019-i-9qg3nj',
    center: [32.655221, 1.344666],
    zoom: 6.1,
    minZoom: 5,
    maxZoom: 8,
    nameProperty: 'DName2019',
    codeProperty: 'dc2018',
    formatter: (value, target = 'map') => {
      if (target === 'map') {
        if (value.toLowerCase() === 'sembabule') {
          return 'SSEMBABULE';
        }
        if (value.toLowerCase() === 'kasanda') {
          return 'KASSANDA';
        }
      }
      if (target === 'tooltip') {
        if (value.toLowerCase() === 'ssembabule') {
          return 'SEMBABULE';
        }
        if (value.toLowerCase() === 'kassanda') {
          return 'KASANDA';
        }
      }

      return value.toUpperCase();
    },
  },
];
const renderLayers = () => {
  const hiddenLayers = layers
    // .filter((layer) => layer.sourceLayer !== options.sourceLayer)
    .map((layer, index) => (
      <BaseMapLayer
        key={`${COLOURED_LAYER}-${index}`}
        id={layer.layerName}
        source="composite"
        source-layer={layer.sourceLayer}
        show={false}
      />
    ));

  //   if (!dataLoading && locationData.length) {
  //     return hiddenLayers.concat(
  //       <BaseMapLayer
  //         key={COLOURED_LAYER}
  //         id={COLOURED_LAYER}
  //         source="composite"
  //         source-layer={'uganda_districts_2019_i-9qg3nj'}
  //         // maxzoom={options.maxZoom && options.maxZoom + 1}
  //         type="fill"
  //         paint={{
  //           'fill-color': {
  //             property: 'DName2019',
  //             type: 'categorical',
  //             default: '#D1CBCF',
  //             // stops: getLocationStyles(locationData, range, colours, options.formatter),
  //           },
  //           'fill-opacity': 0.75,
  //           'fill-outline-color': '#ffffff',
  //         }}
  //         // onAdd={onAddLayer}
  //       />
  //     );
  //   }

  return hiddenLayers.concat(
    <BaseMapLayer
      key={COLOURED_LAYER}
      id={COLOURED_LAYER}
      source="composite"
      source-layer={'uganda_districts_2019_i-9qg3nj'}
      //   maxzoom={options.maxZoom && options.maxZoom + 1}
      type="fill"
      paint={{
        'fill-color': '#D1CBCF',
        'fill-opacity': 0.75,
        'fill-outline-color': '#ffffff',
      }}
      //   onAdd={onAddLayer}
    />
  );
};

const renderViz = (className) => {
  window.DICharts.handler.addChart({
    className,
    echarts: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const dichart = new window.DICharts.Chart(chartNode.parentElement);
          // const filterWrapper = addFilterWrapper(chartNode);
          dichart.showLoading();
          if (window.DIState) {
            const root = createRoot(chartNode);
            window.DIState.addListener(() => {
              dichart.showLoading();
              const { map } = window.DIState.getState;

              if (map) {
                console.log(map);

                root.render(
                  <BaseMap
                    accessToken="pk.eyJ1IjoiZWR3aW5tcCIsImEiOiJjazFsdHVtcG0wOG9mM2RueWJscHhmcXZqIn0.cDR43UvfMaOY9cNJsEKsvg"
                    options={{
                      style: layers[0].style,
                      center: layers[0].center,
                      minZoom: layers[0].minZoom || 6,
                      zoom: layers[0].zoom || 6.1,
                      maxZoom: layers[0].maxZoom || 7,
                      scrollZoom: false,
                    }}
                    style={{ width: '100%', background: '#ffffff' }}
                    // onLoad={onLoad}
                  >
                    {renderLayers()}
                  </BaseMap>
                );
              } else {
                root.render(<NoDataCentered />);
              }

              dichart.hideLoading();
            });
          } else {
            window.console.log('State is not defined');
          }
        });
      },
    },
  });
};

export default renderViz;
