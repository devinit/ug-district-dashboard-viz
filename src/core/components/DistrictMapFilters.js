/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import classNames from 'classnames';
import { useContext } from 'react';
import Select from '../../components/Select';
import { DistrictMapContext } from '../context';
import useData from './hooks/DistrictMapFilters';

const DistrictMapFilters = () => {
  const { filters, topics } = useContext(DistrictMapContext);
  const { topicOptions } = useData(topics);

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
          classNamePrefix="topic-selector"
          isClearable={false}
          css={{ minWidth: '100%' }}
        />
      </div>
    </form>
  );
};

export default DistrictMapFilters;
