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
          const dichart = new window.DICharts.Chart(chartNode.parentElement);
          dichart.showLoading();
          if (window.DIState) {
            const root = createRoot(chartNode);
            window.DIState.addListener(() => {
              dichart.showLoading();
              const { map, location, baseAPIUrl } = window.DIState.getState;

              if (map) {
                root.render(
                  <DistrictMap configs={map} location={location} filters={map.filters} baseAPIUrl={baseAPIUrl} />,
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
