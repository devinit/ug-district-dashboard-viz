import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import DistrictMapFilters from './DistrictMapFilters';

const DistrictMapSidebar = () => (
  <div className="spotlight__content">
    <ErrorBoundary>
      <DistrictMapFilters />
    </ErrorBoundary>
  </div>
);

export default DistrictMapSidebar;
