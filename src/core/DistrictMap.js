import React from 'react';
import { createRoot } from 'react-dom/client';
import DistrictMap from './components/DistrictMap/DistrictMap';
import NoDataCentered from './components/NoDataCentered';

const renderViz = (className) => {
  window.DICharts.handler.addChart({
    className,
    echarts: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          if (window.DIState) {
            window.DIState.addListener(() => {
              const { map, location, baseAPIUrl } = window.DIState.getState;
              const root = createRoot(chartNode);
              if (map) {
                root.render(
                  <DistrictMap configs={map} location={location} filters={map.filters} baseAPIUrl={baseAPIUrl} />
                );
              } else {
                root.render(<NoDataCentered />);
              }
              chartNode.parentElement.classList.remove('chart-container--loading');
            });
          } else {
            window.console.log('State is not defined');
          }
        });
      }
    }
  });
};

export default renderViz;
