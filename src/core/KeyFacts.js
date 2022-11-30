import React from 'react';
import { createRoot } from 'react-dom/client';
import TabContainer from '../components/SpotlightTab/TabContainer';
import TabContent from '../components/SpotlightTab/TabContent';
import TabContentHeader from '../components/SpotlightTab/TabContentHeader';

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
          root.render(
            <div className="tabs">
              <TabContainer id={'tab1'} label="Overview" active={true}>
                <TabContent>
                  <TabContentHeader>Header Goes Here</TabContentHeader>
                  <div className="l-2up-3up">Content Goes Here</div>
                </TabContent>
              </TabContainer>
              <TabContainer id={'tab2'} label="Education">
                <TabContent>
                  <TabContentHeader>Education Header Goes Here</TabContentHeader>
                  <div className="l-2up-3up">Education Content Goes Here</div>
                </TabContent>
              </TabContainer>
            </div>
          );

          dichart.hideLoading();
        });
      },
    },
  });
};

export default renderViz;
