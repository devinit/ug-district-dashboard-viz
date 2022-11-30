import fetchCSVData from '../utils/data';
import { addFilter, addFilterWrapper } from '../widgets/filters';

const init = (className) => {
  window.DICharts.handler.addChart({
    className,
    d3: {
      onAdd: (chartNodes) => {
        Array.prototype.forEach.call(chartNodes, (chartNode) => {
          const dichart = new window.DICharts.Chart(chartNode.parentElement);
          dichart.showLoading();

          /**
           * ECharts - prefix all browsers global with window
           * i.e window.echarts - echarts won't work without it
           *
           * const chart = window.echarts.init(chartNode);
           */
          const csv = 'https://raw.githubusercontent.com/devinit/di-website-data/main/2022/rh-and-fp-dropdowns.csv';
          fetchCSVData(csv).then((data) => {
            const filterWrapper = addFilterWrapper(chartNode);
            const countryFilter = addFilter({
              wrapper: filterWrapper,
              options: data.map((d) => d.Donors),
              defaultOption: 'United States',
              className: 'subcounty-filter',
              label: 'Select Subcounty',
            });

            if (window.DIState) {
              window.DIState.setState({ subCounty: 'United States' });
            }

            // add event listeners
            countryFilter.addEventListener('change', (event) => {
              const { value } = event.currentTarget;
              if (window.DIState) {
                window.DIState.setState({ country: value });
              }
            });

            dichart.hideLoading();
            chartNode.parentElement.classList.add('auto-height');
          });
        });
      },
    },
  });
};

export default init;
