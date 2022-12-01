/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import TabContainer from '../../components/SpotlightTab/TabContainer';
import TabContent from '../../components/SpotlightTab/TabContent';
import TabContentHeader from '../../components/SpotlightTab/TabContentHeader';

const KeyFacts = () => (
  <div className="tabs">
    <TabContainer id="overview" label="Overview" active={true}>
      <TabContent>
        <TabContentHeader>
          <div
            css={css`
              display: flex;
            `}
          >
            <div
              css={css`
                margin-right: 1rem;
              `}
            >
              <span
                css={css`
                  font-size: 2.5rem;
                `}
              >
                Total Population in Masindi is{' '}
              </span>
              <b
                css={css`
                  font-size: 3rem;
                `}
              >
                7,151,502
              </b>
            </div>
            <div className="button button--secondary--fill">View Full Dashboard</div>
          </div>
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

KeyFacts.propTypes = {
  data: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
};

export default KeyFacts;
