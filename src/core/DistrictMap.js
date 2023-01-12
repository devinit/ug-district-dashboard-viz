import React from 'react';
import { createRoot } from 'react-dom/client';
import DistrictMap from './components/DistrictMap';
import NoDataCentered from './components/NoDataCentered';
import schools from '../../public/assets/data/masindi/numberOfSchools.json';
import { aggregateValues } from './utils/index';

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
              const { map, location } = window.DIState.getState;

              const data = aggregateValues(schools, map.aggregator);
              // const avgs = aggregateValues(schools, 'avg');
              console.log(JSON.stringify(data));
              console.log(JSON.stringify(map));
              if (map) {
                root.render(<DistrictMap configs={map} location={location} filters={map.filters} data={data} />);
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
