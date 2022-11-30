import './state';
import renderEChart from './core/ExampleChart';
import renderTable from './core/ExampleTable';
import initSubcountySelector from './components/SubCountyFilter';
import './styles/styles.css';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  initSubcountySelector('subcounty-selector');
  renderEChart();
  renderTable('dicharts--table-example');
});
