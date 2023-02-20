import renderSelectors from './core/SelectorDropdowns';
import './state';
// import renderEChart from './core/charts/ExampleChart';
// import renderTable from './core/tables/ExampleTable';
import renderEducationCharts from './core/charts/EducationCharts';
import renderDistrictMap from './core/DistrictMap';
import renderKeyFacts from './core/KeyFacts';
import renderEducationTables from './core/tables/EducationTables';
import './styles/styles.css';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  renderSelectors('district-selectors', 'subcounty, level');
  renderSelectors('ple-performance-selectors', 'ownership');
  renderDistrictMap('dicharts--district-map');
  // renderEChart();
  renderEducationTables();
  renderKeyFacts('dicharts--keyfacts');
  renderEducationCharts();
});
