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
  const { year, indicator } = filterOptions;

  const onChange = (item, filter, currentFilterValue) => {
    if (Array.isArray(item) && item.length) {
      if (item[0].value !== currentFilterValue) {
        updateFilterOptions({ [filter]: item[0].value });
      }
    } else if (item && !Array.isArray(item)) {
      if (item.value !== currentFilterValue) {
        updateFilterOptions({ [filter]: item && item.value });
      }
    }
  };

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
            value={[
              indicator
                ? indicatorOptions.find((optn) => optn.value === indicator) || indicatorOptions[0]
                : indicatorOptions[0],
            ]}
            classNamePrefix="indicator-selector"
            isClearable={false}
            css={{ minWidth: '100%', marginTop: '1em' }}
            onChange={(item) => onChange(item, 'indicator', indicator)}
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
            onChange={(item) => onChange(item, 'year', year)}
          />
        ) : null}
      </div>
    </form>
  );
};

export default DistrictMapFilters;
