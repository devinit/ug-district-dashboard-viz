import { handleResize } from '../charts/echarts/index';

const renderNumberOfSchoolsChart = () => {
  window.DICharts.handler.addChart({
    className: 'number-of-schools',
    echarts: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const dichart = new window.DICharts.Chart(chartNode.parentElement);

          // Render echarts coding here
          const chart = window.echarts.init(chartNode);

          dichart.hideLoading();

          // add responsiveness
          handleResize(chart, chartNode);
        });
      },
    },
  });
};

export default renderNumberOfSchoolsChart;
