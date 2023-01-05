/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import classNames from 'classnames';
import { useContext } from 'react';
import Select from '../../components/Select';
import { DistrictMapContext } from '../context';
import useData from './hooks/DistrictMapFilters';

const DistrictMapFilters = () => {
  const { filters, topics, updateFilterOptions } = useContext(DistrictMapContext);
  const { topicOptions, indicatorOptions } = useData(topics);

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
      </div>
    </form>
  );
};

export default DistrictMapFilters;
