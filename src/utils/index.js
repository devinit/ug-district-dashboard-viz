import deepMerge from 'deepmerge';
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

export const combineMerge = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepMerge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });

  return destination;
};

export * from './chart';
export * from './constants';
