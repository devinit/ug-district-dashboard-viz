/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useContext } from 'react';
import TabContainer from '../../components/SpotlightTab/TabContainer';
import TabContent from '../../components/SpotlightTab/TabContent';
import TabContentHeader from '../../components/SpotlightTab/TabContentHeader';
import { KeyFactsContext } from '../context';

const OverviewTab = () => {
  const { data, location } = useContext(KeyFactsContext);
  window.console.log(data, location);

  return (
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
  );
};

export default OverviewTab;
