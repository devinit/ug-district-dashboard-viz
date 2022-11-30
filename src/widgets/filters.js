/* eslint-disable import/prefer-default-export */
export const addFilterWrapper = (chartNode) => {
  const filterWrapper = document.createElement('div');
  filterWrapper.classList.add(...['spotlight-banner', 'data-selector--wrapper']);
  chartNode.parentElement.insertBefore(filterWrapper, chartNode);

  return filterWrapper;
};

export const createOption = (selectElement, option) => {
  const optionElement = document.createElement('option');
  optionElement.value = typeof option === 'string' ? option : option.value;
  optionElement.text = typeof option === 'string' ? option : option.label;
  selectElement.appendChild(optionElement);
};

export const addFilter = ({ wrapper, options, defaultOption, allItemsLabel, className, label }) => {
  const selectElement = document.createElement('select');
  selectElement.classList.add(...['data-selector', 'js-plotly-chart-data-selector', className]);
  if (allItemsLabel) {
    createOption(selectElement, { label: allItemsLabel, value: '*' });
  }
  options.forEach((option) => createOption(selectElement, option));
  selectElement.classList.add('data-selector--active');
  if (defaultOption) {
    selectElement.value = defaultOption;
  }

  if (label) {
    // create labelled filter
    const labelElement = document.createElement('label');
    labelElement.innerHTML = label;
    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('labelled-data-selector--wrapper');
    selectWrapper.appendChild(labelElement);
    selectWrapper.appendChild(selectElement);
    wrapper.appendChild(selectWrapper);
  } else {
    wrapper.appendChild(selectElement);
  }

  return selectElement;
};
