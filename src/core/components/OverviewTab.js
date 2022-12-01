/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useContext } from 'react';
import SpotlightPopup from '../../components/SpotlightPopup';
import TabContainer from '../../components/SpotlightTab/TabContainer';
import TabContent from '../../components/SpotlightTab/TabContent';
import TabContentHeader from '../../components/SpotlightTab/TabContentHeader';
import { formatNumber } from '../../utils/data';
import { KeyFactsContext } from '../context';

const OverviewTab = () => {
  const { data, location, options } = useContext(KeyFactsContext);

  return (
    <TabContainer id="overview" label="Overview" active={true}>
      <TabContent>
        <TabContentHeader>
          {data && data.population ? (
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
                  Total Population in {location.name} is{' '}
                </span>
                <b
                  css={css`
                    font-size: 3rem;
                  `}
                >
                  {formatNumber(data.population.value)}
                </b>
                <SpotlightPopup description={`Last updated: ${data.population.lastUpdated}`} />
              </div>
              {options.dashboardURL ? (
                <a href={options.dashboardURL} className="button button--secondary--fill">
                  {options.dashboardButtonCaption || 'View Full Dashboard'}
                </a>
              ) : null}
            </div>
          ) : null}
        </TabContentHeader>
        <div className="l-2up-3up">Content Goes Here</div>
      </TabContent>
    </TabContainer>
  );
};

export default OverviewTab;
