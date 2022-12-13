/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { KeyFactsContext } from '../context';
import EducationTab from './EducationTab';
import OverviewTab from './OverviewTab';
import ProductionTab from './ProductionTab';
import SpotlightTab from '../../components/SpotlightTab';

const formatData = (data) => {
  const formattedData = {};

  const format = (item) => ({ caption: item.Item, value: item.Value, lastUpdated: item['Last Updated'] });

  const POPULATION_KEY = 'Total Population';
  // extract population data
  const popData = data.find((item) => item.Item === POPULATION_KEY);
  if (popData) {
    formattedData.population = format(popData);
  }
  // extract and format administration data
  formattedData.administration = data
    .filter((item) => item.Item !== POPULATION_KEY && item.Department === 'Administration')
    .map(format);

  // extract and format education data
  formattedData.education = data
    .filter((item) => item.Item !== POPULATION_KEY && item.Department === 'Education')
    .map(format);

  // extract and format production data
  formattedData.production = data
    .filter((item) => item.Item !== POPULATION_KEY && item.Department === 'Production')
    .map(format);

  return formattedData;
};

const KeyFacts = (props) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (props.data) {
      setData(formatData(props.data));
    }
  }, [props.data]);

  return (
    <KeyFactsContext.Provider value={{ ...props, data }}>
      <SpotlightTab>
        <OverviewTab active />
        <EducationTab />
        <ProductionTab />
      </SpotlightTab>
    </KeyFactsContext.Provider>
  );
};

KeyFacts.propTypes = {
  data: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default KeyFacts;
