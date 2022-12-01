import './state';
import renderEChart from './core/ExampleChart';
import renderTable from './core/ExampleTable';
import initSelectors from './components/SelectorDropdowns';
import './styles/styles.css';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  initSelectors('district-selectors');
  renderEChart();
  // renderTable('dicharts--table-example');
});
