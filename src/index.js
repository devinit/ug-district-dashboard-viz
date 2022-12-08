import './state';
import renderSelectors from './core/SelectorDropdowns';
// import renderEChart from './core/charts/ExampleChart';
// import renderTable from './core/tables/ExampleTable';
import renderEducationCharts from './core/charts/EducationCharts';
import renderEducationTables from './core/tables/EducationTables';
import './styles/styles.css';
import renderKeyFacts from './core/KeyFacts';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  renderSelectors('district-selectors');
  // renderEChart();
  renderEducationTables();
  renderKeyFacts('dicharts--keyfacts');
  renderEducationCharts();
});
