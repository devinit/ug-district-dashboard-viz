import './state';
import initSelectors from './components/SelectorDropdowns';
// import renderEChart from './core/ExampleChart';
// import renderTable from './core/ExampleTable';
import './styles/styles.css';
import renderKeyFacts from './core/KeyFacts';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  initSelectors('district-selectors');
  // renderEChart();
  // renderTable('dicharts--table-example');
  renderKeyFacts('dicharts--keyfacts');
});
