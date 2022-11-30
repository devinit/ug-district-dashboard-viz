import barChartVertical from '../../../public/assets/js/charts/barChartVertical';

/**
 * Run your code after the page has loaded
 */

const dataset = {
  data: [
    {
      col_x: 'Rust',
      col_y: 100.9,
      color: '#000000',
    },
    {
      col_x: 'Kotlin',
      col_y: 10.1,
      color: '#00a2ee',
    },
    {
      col_x: 'Python',
      col_y: 6.0,
      color: '#fbcb39',
    },
    {
      col_x: 'TypeScript',
      col_y: 67.0,
      color: '#007bc8',
    },
    {
      col_x: 'Go',
      col_y: 65.6,
      color: '#65cedb',
    },
    {
      col_x: 'Swift',
      col_y: 65.1,
      color: '#ff6e52',
    },
    {
      col_x: 'JavaScript',
      col_y: 61.9,
      color: '#f9de3f',
    },
    {
      col_x: 'C#',
      col_y: 15.4,
      color: '#5d2f8e',
    },
    {
      col_x: 'F#',
      col_y: 59.6,
      color: '#008fc9',
    },
    {
      col_x: 'Clojure',
      col_y: 59.6,
      color: '#507dca',
    },
  ],
  columns: ['col_x', 'col_y'],
};

const renderD3Chart = () => {
  window.DICharts.handler.addChart({
    className: 'dicharts--d3-boilerplate-chart',
    d3: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const dichart = new window.DICharts.Chart(chartNode);
          // do custom d3 coding here
          barChartVertical(chartNode, dataset);

          dichart.hideLoading();
        });
      },
    },
  });
};

export default renderD3Chart;
