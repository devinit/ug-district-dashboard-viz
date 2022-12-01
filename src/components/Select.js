/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ReactSelect from 'react-select';

const selectStyles = {
  control: (styles) => ({
    ...styles,
    borderColor: '#ddd',
    borderRadius: 'none',
    boxShadow: 'none',
    ':hover': { borderColor: '#8f1b13' },
    ':active': { borderColor: '#8f1b13' },
  }),
  option: (styles) => ({ ...styles, fontSize: '14px' }),
  singleValue: (styles) => ({ ...styles, fontSize: '14px' }),
  multiValue: (styles) => ({ ...styles, fontSize: '14px' }),
  multiValueLabel: (base, state) => (!state.data.isCloseable ? { ...base, paddingRight: 6 } : base),
  multiValueRemove: (base, state) => (!state.data.isCloseable ? { ...base, display: 'none' } : base),
  input: (styles) => ({ ...styles, fontSize: '14px' }),
  indicatorsContainer: (styles) => ({ ...styles, pointerEvents: 'none' }), // activates select to mobile touch events
};

const Select = ({ label, onError, maxSelectedOptions, defaultValue, singleSelectOptions, ...props }) => {
  const [values, setValues] = useState(defaultValue);
  useEffect(() => {
    if (props.onChange) props.onChange(values);
    if (onError) onError(); // reset error message
  }, [values]);

  const onChange = (_values) => {
    if (!props.isMulti) {
      setValues(_values);

      return;
    }

    if (!_values.length) {
      setValues(defaultValue);

      return;
    }

    // handle options that should not be compared
    const singleSelectOptionIndex = _values.findIndex((item) =>
      singleSelectOptions.find((option) => option.value === item.value)
    );
    if (props.isMulti && _values.length > 1 && singleSelectOptionIndex !== -1) {
      setValues(singleSelectOptionIndex === 0 ? _values.slice(1) : [_values[singleSelectOptionIndex]]);

      return;
    }

    if (maxSelectedOptions && _values.length > maxSelectedOptions) {
      if (onError) {
        onError({
          type: 'maxSelectedOptions',
          message: `Only up to ${maxSelectedOptions} selections allowed`,
        });
      }

      return;
    }

    setValues(_values);
  };

  return (
    <div className="labelled-data-selector--wrapper">
      <label>
        <b>{label}</b>
      </label>
      <ReactSelect
        {...props}
        value={values}
        onChange={onChange}
        css={{ marginRight: '25px' }}
        styles={selectStyles}
        isClearable={props.isClearable !== 'undefined' ? props.isClearable : values.length > 1}
      />
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  maxSelectedOptions: PropTypes.number,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  defaultValue: PropTypes.array,
  singleSelectOptions: PropTypes.array,
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
};

Select.defaultProps = { maxSelectedOptions: 2, singleSelectOptions: [] };

export default Select;
