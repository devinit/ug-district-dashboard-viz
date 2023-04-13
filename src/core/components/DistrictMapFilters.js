/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import classNames from 'classnames';
import { useContext } from 'react';
import Select from '../../components/Select';
import { DistrictMapContext } from '../context';
import useData from './hooks/DistrictMapFilters';

const DistrictMapFilters = () => {
  const { filters, topics, filterOptions, updateFilterOptions } = useContext(DistrictMapContext);
  const { topicOptions, indicatorOptions, yearOptions } = useData(topics);
  const { year } = filterOptions;

  return (
    <form className="form">
      <div
        className={classNames('form-field', 'form-field--inline-block')}
        css={css`
          z-index: auto;
          margin-left: 5px;
        `}
      >
        <Select
          label={filters.topicLabel}
          options={topicOptions}
          defaultValue={[topicOptions[0]]}
          classNamePrefix="topic-selector"
          isClearable={false}
          css={{ minWidth: '100%' }}
          onChange={(item) => updateFilterOptions({ topic: item && item.value })}
        />
        {indicatorOptions && indicatorOptions.length ? (
          <Select
            label={filters.indicatorLabel}
            options={indicatorOptions}
            defaultValue={[indicatorOptions[0]]}
            classNamePrefix="indicator-selector"
            isClearable={false}
            css={{ minWidth: '100%', marginTop: '1em' }}
            onChange={(item) => updateFilterOptions({ indicator: item && item.value })}
          />
        ) : null}
        {yearOptions && yearOptions.length ? (
          <Select
            label={filters.yearLabel}
            options={yearOptions}
            value={[year ? yearOptions.find((optn) => optn.value === year) || yearOptions[0] : yearOptions[0]]}
            classNamePrefix="year-selector"
            isClearable={false}
            css={{ minWidth: '100%', marginTop: '1em' }}
            onChange={(item) => {
              if (Array.isArray(item) && item.length) {
                if (item[0].value !== year) {
                  updateFilterOptions({ year: item[0].value });
                }
              } else if (item && !Array.isArray(item)) {
                if (item.value !== year) {
                  updateFilterOptions({ year: item.value });
                }
              }
            }}
          />
        ) : null}
      </div>
    </form>
  );
};

export default DistrictMapFilters;
