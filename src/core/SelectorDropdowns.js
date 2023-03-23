/** @jsx jsx */
import { jsx } from '@emotion/react';
import { createRoot } from 'react-dom/client';
import { addFilterWrapper } from '../widgets/filters';
import Selectors from './components/Selectors';

const renderSelectors = (className, options = { makeSticky: false }) => {
  window.DICharts.handler.addChart({
    className,
    d3: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const dichart = new window.DICharts.Chart(chartNode.parentElement);
          dichart.showLoading();

          const chartParentSection = chartNode.closest('.section');

          if (!options.makeSticky) {
            chartParentSection.classList.add('sticky'); // means it's a top level selector
          }

          const selectorWrapper = addFilterWrapper(chartNode);
          const rootElement = createRoot(selectorWrapper);
          if (window.DIState) {
            window.DIState.addListener(() => {
              dichart.showLoading();
              // if not explicitly provided, get selector configs from state
              const { selectors } = options.selectors ? options : window.DIState.getState;

              if (!selectors) {
                window.console.log('Waiting on state update ...');

                return;
              }

              if (!Array.isArray(selectors)) {
                window.console.log(
                  'Invalid value for selectors - an Array is expected. Please review the documentation!'
                );
              }
              rootElement.render(
                <Selectors
                  configs={selectors}
                  onChange={(selector, item) => {
                    window.DIState.setState({ [selector.stateProperty]: item.value });
                  }}
                />
              );
            });
          } else {
            window.console.log('State is not defined');
          }

          dichart.hideLoading();
          chartNode.parentElement.classList.add('auto-height');
        });
      },
    },
  });
};

export default renderSelectors;
