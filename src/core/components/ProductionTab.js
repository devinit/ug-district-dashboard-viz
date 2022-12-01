/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useContext } from 'react';
import IndicatorStat from '../../components/IndicatorStat';
import IndicatorStatDataViewer from '../../components/IndicatorStat/IndicatorStatDataViewer';
import TabContainer from '../../components/SpotlightTab/TabContainer';
import TabContent from '../../components/SpotlightTab/TabContent';
import SpotlightPopup from '../../components/SpotlightPopup';
import TabContentHeader from '../../components/SpotlightTab/TabContentHeader';
import { formatNumber } from '../../utils/data';
import { KeyFactsContext } from '../context';

const ProductionTab = () => {
  const { data, location, options } = useContext(KeyFactsContext);

  const HEADING_CAPTION = '';
  const heading = data && data.production ? data.production.find((item) => item.caption === HEADING_CAPTION) : null;

  const renderDashboardButton = () =>
    options.dashboardURL ? (
      <a href={options.dashboardURL} className="button button--secondary--fill">
        {options.dashboardButtonCaption || 'View Full Dashboard'}
      </a>
    ) : null;

  return (
    <TabContainer id="production" label="Production">
      <TabContent>
        {heading ? (
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
                  Number of Schools in {location.name} is{' '}
                </span>
                <b
                  css={css`
                    font-size: 3rem;
                  `}
                >
                  {formatNumber(heading.value)}
                </b>
                <SpotlightPopup description={`Last updated: ${heading.lastUpdated}`} />
              </div>
              {renderDashboardButton()}
            </div>
          </TabContentHeader>
        ) : (
          renderDashboardButton()
        )}
        {data && data.production && data.production.length ? (
          <div className="l-2up">
            {data.production
              .filter((item) => item.caption !== HEADING_CAPTION)
              .map((item) => (
                <div className="l-2up__col" key={item.caption}>
                  <IndicatorStat
                    heading={item.caption}
                    meta={{
                      description: (
                        <span
                          css={css`
                            display: flex;
                            justify-content: center;
                          `}
                        >{`Last updated: ${item.lastUpdated}`}</span>
                      ),
                    }}
                  >
                    <IndicatorStatDataViewer value={item.value} />
                  </IndicatorStat>
                </div>
              ))}
          </div>
        ) : (
          <div
            css={css`
              font-size: 16px;
              display: flex;
              justify-content: center;
              width: 100%;
            `}
          >
            No Production Data
          </div>
        )}
      </TabContent>
    </TabContainer>
  );
};

export default ProductionTab;
