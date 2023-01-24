import React, { useContext } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { DistrictMapContext } from '../context';
import DistrictMapFilters from './DistrictMapFilters';
import Legend from './Legend/Legend';
import LegendItem from './Legend/LegendItem';

export const renderLegendItems = (range, colours) => {
  if (range && colours) {
    return range
      .map((rnge, index) => (
        <LegendItem className={`item-${rnge}`} bgColor={colours[index]} key={index}>
          {index === 0 ? `< ${range[0]}` : `${range[index - 1]}-${rnge}`}
        </LegendItem>
      ))
      .concat([
        <LegendItem className={`item-last`} bgColor={colours[colours.length - 1]} key={range.length}>
          {`> ${range[range.length - 1]}`}
        </LegendItem>,
      ]);
  }

  return null;
};

const DistrictMapSidebar = () => {
  const { activeIndicator } = useContext(DistrictMapContext);

  return (
    <div className="spotlight__content">
      <ErrorBoundary>
        <DistrictMapFilters />
      </ErrorBoundary>
      {activeIndicator ? (
        <Legend>
          {renderLegendItems(activeIndicator.range, activeIndicator.colours)}
          <LegendItem>no data / not applicable</LegendItem>
        </Legend>
      ) : null}
    </div>
  );
};

export default DistrictMapSidebar;
