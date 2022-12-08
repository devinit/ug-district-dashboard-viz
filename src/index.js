import './state';
import renderSelectors from './core/SelectorDropdowns';
// import renderEChart from './core/charts/ExampleChart';
// import renderTable from './core/tables/ExampleTable';
import renderEducationCharts from './core/charts/EducationCharts';
import renderTable from './core/NumberOfSchoolsTable';
import './styles/styles.css';
import renderKeyFacts from './core/KeyFacts';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  renderSelectors('district-selectors');
  // renderEChart();
  renderTable('dicharts--table--number-of-schools');
  renderKeyFacts('dicharts--keyfacts');
  renderEducationCharts();
});
