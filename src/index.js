import './state';
import renderEChart from './core/ExampleChart';
import initSelectors from './components/SelectorDropdowns';
import './styles/styles.css';

/**
 * Run your code after the page has loaded
 */
window.addEventListener('load', () => {
  initSelectors('district-selectors');
  renderEChart();
});
