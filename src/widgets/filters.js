/* eslint-disable import/prefer-default-export */
export const addFilterWrapper = (chartNode) => {
  const filterWrapper = document.createElement('div');
  filterWrapper.classList.add(...['spotlight-banner', 'data-selector--wrapper']);
  chartNode.parentElement.insertBefore(filterWrapper, chartNode);

  return filterWrapper;
};
