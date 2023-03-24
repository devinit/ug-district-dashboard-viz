/** @jsx jsx */
import { jsx } from '@emotion/react';
import { createRoot } from 'react-dom/client';
import { createFilterWrapper } from '../widgets/filters';
import Selectors from './components/Selectors';

// TODO: figure out how to update a react dom without recreating it - perhaps via the rootElement. Promise.all could help here as well
const renderSelectors = (className, options = { makeSticky: false }) => {
  const promises = [];

  const onChange = (selector, item) => {
    window.DIState.setState({ [selector.config.stateProperty]: item.value });
  };

  // Used to update existing selectors, especially if you want to reset them. FIXME: Not really happy with this solution.
  // Best way to do this is to pass in the same nodes that this function returns
  if (options.nodes && options.nodes.length) {
    options.nodes.forEach((selectorNode) => {
      promises.push(
        new Promise((resolve) => {
          selectorNode.render(
            <Selectors key={`${Math.random()}`} configs={options.selectors} onChange={options.onChange || onChange} />
          );
          resolve(selectorNode);
        })
      );
    });

    return Promise.all(promises);
  }

  Array.prototype.forEach.call(document.querySelectorAll(`.${className}`), (selectorNode) => {
    promises.push(
      new Promise((resolve) => {
        const dichart = new window.DICharts.Chart(selectorNode.parentElement);
        dichart.showLoading();

        const chartParentSection = selectorNode.closest('.section');

        if (options.makeSticky) {
          chartParentSection.classList.add('sticky'); // means it's a top level selector
        }

        const selectorWrapper = createFilterWrapper(selectorNode);
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
            rootElement.render(<Selectors configs={selectors} onChange={options.onChange || onChange} />);
          });
        } else {
          window.console.log('State is not defined');
        }

        dichart.hideLoading();
        selectorNode.parentElement.classList.add('auto-height');

        resolve(rootElement);
      })
    );
  });

  return Promise.all(promises);
};

export default renderSelectors;
