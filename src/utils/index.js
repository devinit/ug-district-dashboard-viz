import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import NoData from '../components/NoData';

export const addNoData = (rootNode) => {
  rootNode.classList.add('no-data--wrapper');
  unmountComponentAtNode(rootNode);
  render(createElement(NoData), rootNode);
};

export const removeNoData = (rootNode) => {
  rootNode.classList.remove('no-data--wrapper');
  unmountComponentAtNode(rootNode);
};

export * from './constants';
export * from './chart';
