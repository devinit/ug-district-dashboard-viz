import React from 'react';
import TabContainer from '../../components/SpotlightTab/TabContainer';
import TabContent from '../../components/SpotlightTab/TabContent';
import TabContentHeader from '../../components/SpotlightTab/TabContentHeader';

const KeyFacts = () => (
  <div className="tabs">
    <TabContainer id="overview" label="Overview" active={true}>
      <TabContent>
        <TabContentHeader>
          <label>Header Goes Here</label>
        </TabContentHeader>
        <div className="l-2up-3up">Content Goes Here</div>
      </TabContent>
    </TabContainer>
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
);

export default KeyFacts;
