/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import 'react';
import Select from '../../components/Select';

const ChartTypeSelector = (props) => (
  <Select
    options={props.options}
    isClearable={false}
    defaultValue={[props.options[0]]}
    onChange={(item) => props.onChange(item.value)}
    css={{ minWidth: '200px', marginLeft: '2em' }}
  />
);

ChartTypeSelector.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
};

export default ChartTypeSelector;
