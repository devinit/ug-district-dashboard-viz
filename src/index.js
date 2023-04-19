import renderSelectors from './core/SelectorDropdowns';
import './state';
// import renderEChart from './core/charts/ExampleChart';
// import renderTable from './core/tables/ExampleTable';
import renderCharts from './core/charts/Charts';
import renderDistrictMap from './core/DistrictMap';
import renderKeyFacts from './core/KeyFacts';
import renderTables from './core/tables/Tables';
import './styles/styles.css';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  renderSelectors('district-selectors', { makeSticky: true });
  renderDistrictMap('dicharts--district-map');
  // renderEChart();
  renderTables();
  renderKeyFacts('dicharts--keyfacts');
  renderCharts();
});
