import './state';
import renderSelectors from './core/SelectorDropdowns';
// import renderEChart from './core/ExampleChart';
// import renderTable from './core/ExampleTable';
import './styles/styles.css';
import renderKeyFacts from './core/KeyFacts';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  renderSelectors('district-selectors');
  // renderEChart();
  // renderTable('dicharts--table-example');
  renderKeyFacts('dicharts--keyfacts');
});
