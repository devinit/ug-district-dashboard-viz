/* eslint-disable import/prefer-default-export */

export const toggleShowChart = (chartNode, show = true) => {
  if (show) {
    chartNode.classList.remove('invisible');
  } else {
    chartNode.classList.add('invisible');
  }
};
