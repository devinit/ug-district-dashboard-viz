import React from 'react';
import { createRoot } from 'react-dom/client';
import KeyFacts from './components/KeyFacts';

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

          // create dropdowns
          const root = createRoot(chartNode);
          root.render(<KeyFacts />);

          dichart.hideLoading();
        });
      },
    },
  });
};

export default renderViz;
