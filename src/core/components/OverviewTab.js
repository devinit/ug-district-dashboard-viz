/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import IndicatorStat from '../../components/IndicatorStat';
import IndicatorStatDataViewer from '../../components/IndicatorStat/IndicatorStatDataViewer';
import SpotlightPopup from '../../components/SpotlightPopup';
import TabContainer from '../../components/SpotlightTab/TabContainer';
import TabContent from '../../components/SpotlightTab/TabContent';
import TabContentHeader from '../../components/SpotlightTab/TabContentHeader';
import { formatNumber } from '../../utils/data';
import { KeyFactsContext } from '../context';
import { getTabOptions } from '../utils';

const OverviewTab = (props) => {
  const { data, location, options } = useContext(KeyFactsContext);
  const id = 'overview';
  const tabOptions = getTabOptions(options.tabs, id);

  if (tabOptions.show !== undefined && !tabOptions.show) return null;

  return (
    <TabContainer id={id} label={tabOptions.label || 'Overview'} active={!!props.active || tabOptions.active}>
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
              {tabOptions.dashboardURL ? (
                <a href={tabOptions.dashboardURL} className="button button--secondary--fill">
                  {tabOptions.dashboardButtonCaption || 'View Full Dashboard'}
                </a>
              ) : null}
            </div>
          ) : null}
        </TabContentHeader>
        <div className="l-2up">
          {data && data.administration
            ? data.administration.map((item) => (
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
              ))
            : null}
        </div>
      </TabContent>
    </TabContainer>
  );
};

OverviewTab.propTypes = {
  active: PropTypes.bool,
};

export default OverviewTab;
