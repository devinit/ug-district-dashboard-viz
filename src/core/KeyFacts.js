import React from 'react';
import { createRoot } from 'react-dom/client';
import fetchCSVData from '../utils/data';
import KeyFacts from './components/KeyFacts';
import NoDataCentered from './components/NoDataCentered';

/**
 * Run your code after the page has loaded
 */
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
              const { keyFacts, location } = window.DIState.getState;

              if (keyFacts && keyFacts.url) {
                if (keyFacts.url.endsWith('.csv')) {
                  fetchCSVData(keyFacts.url).then((data) => {
                    root.render(<KeyFacts data={data} location={location} />);
                  });
                } else {
                  window
                    .fetch(keyFacts.url)
                    .then((response) => response.json())
                    .then((data) => {
                      if (Array.isArray(data)) {
                        window.console.log(data);
                        root.render(<KeyFacts data={data} location={location} />);
                      } else if (data.results) {
                        root.render(<KeyFacts data={data.results} location={location} />);
                      } else {
                        window.console.error(
                          'Invalid data shape. Expected an array or an object with a results property.',
                          data
                        );
                        root.render(<NoDataCentered />);
                      }
                    })
                    .catch((error) => {
                      window.console.log(error);
                      root.render(<NoDataCentered />);
                    });
                }
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
