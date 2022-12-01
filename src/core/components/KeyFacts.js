/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import TabContainer from '../../components/SpotlightTab/TabContainer';
import TabContent from '../../components/SpotlightTab/TabContent';
import TabContentHeader from '../../components/SpotlightTab/TabContentHeader';
import { KeyFactsContext } from '../context';
import OverviewTab from './OverviewTab';

const KeyFacts = (props) => {
  window.console.log(props);

  return (
    <KeyFactsContext.Provider value={{ ...props }}>
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
};

export default KeyFacts;
