import './state';
import renderD3Chart from './charts/d3/exampleChart';
import renderEChart from './core/ExampleChart';
import renderTable from './core/ExampleTable';
import './styles/styles.css';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  renderD3Chart();
  renderEChart();
  renderTable('dicharts--table-example');
});
