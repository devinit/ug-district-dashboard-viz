import React from 'react';
import { createRoot } from 'react-dom/client';
import fetchData, { fetchDataFromAPI } from '../utils/data';
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

              if (keyFacts && (keyFacts.url || keyFacts.dataID)) {
                const dataFetchFunction = keyFacts.url ? fetchData : fetchDataFromAPI;
                dataFetchFunction(keyFacts.url || keyFacts.dataID)
                  .then((data) => {
                    if (Array.isArray(data)) {
                      root.render(<KeyFacts data={data} options={keyFacts} location={location} />);
                    } else if (data.results) {
                      root.render(<KeyFacts data={data.results} options={keyFacts} location={location} />);
                    } else {
                      window.console.error(
                        'Invalid data shape. Expected an array or an object with a results property.',
                        data,
                      );
                      root.render(<NoDataCentered />);
                    }
                  })
                  .catch((error) => {
                    window.console.log(error);
                    root.render(<NoDataCentered />);
                  });
              } else if (keyFacts && keyFacts.data) {
                root.render(<KeyFacts data={keyFacts.data} options={keyFacts} location={location} />);
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
