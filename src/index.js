import './state';
import renderEChart from './core/ExampleChart';
import renderTable from './core/ExampleTable';
import './styles/styles.css';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  renderEChart();
  renderTable('dicharts--table-example');
});
