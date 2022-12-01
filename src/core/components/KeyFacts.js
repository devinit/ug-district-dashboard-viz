/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import TabContainer from '../../components/SpotlightTab/TabContainer';
import TabContent from '../../components/SpotlightTab/TabContent';
import TabContentHeader from '../../components/SpotlightTab/TabContentHeader';
import { KeyFactsContext } from '../context';
import OverviewTab from './OverviewTab';

const formatData = (data) => {
  // console.log(data);
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

  return formattedData;
};

const KeyFacts = (props) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (props.data) {
      setData(formatData(props.data));
    }
  }, [props.data]);

  return (
    <KeyFactsContext.Provider value={{ ...props, data }}>
      <div className="tabs">
        <OverviewTab />
        <TabContainer id="education" label="Education">
          <TabContent>
            <TabContentHeader>
              <label>Education Header Goes Here</label>
            </TabContentHeader>
            <div className="l-2up-3up">Education Content Goes Here</div>
          </TabContent>
        </TabContainer>
        <TabContainer id="production" label="Production">
          <TabContent>
            <TabContentHeader>
              <label>Production Header Goes Here</label>
            </TabContentHeader>
            <div className="l-2up-3up">Production Content Goes Here</div>
          </TabContent>
        </TabContainer>
      </div>
    </KeyFactsContext.Provider>
  );
};

KeyFacts.propTypes = {
  data: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default KeyFacts;
