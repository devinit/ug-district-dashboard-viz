import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import DistrictMapFilters from './DistrictMapFilters';
import Legend from './Legend/Legend';
import LegendItem from './Legend/LegendItem';
import { renderLegendItems } from '../../components/BaseMap/utils';

const DistrictMapSidebar = () => (
  <div className="spotlight__content">
    <ErrorBoundary>
      <DistrictMapFilters />
    </ErrorBoundary>
    <Legend>
      {renderLegendItems([5, 10, 15, 20], ['#faa2c1', '#f06595', '#d6336c', '#c2255c', '#a61e4d'])}
      <LegendItem>no data / not applicable</LegendItem>
    </Legend>
  </div>
);

export default DistrictMapSidebar;
