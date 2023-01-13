import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import DistrictMapFilters from './DistrictMapFilters';
import Legend from './Legend/Legend';
import LegendItem from './Legend/LegendItem';
import { renderLegendItems } from '../../components/BaseMap/utils';

const DistrictMapSidebar = () => {
  const { map } = window.DIState.getState;
  const range = map.aggregator === 'sum' ? map.rangeSum : map.rangeAvg;

  return (
    <div className="spotlight__content">
      <ErrorBoundary>
        <DistrictMapFilters />
      </ErrorBoundary>
      <Legend>
        {renderLegendItems(range, map.colours)}
        <LegendItem>no data / not applicable</LegendItem>
      </Legend>
    </div>
  );
};

export default DistrictMapSidebar;
