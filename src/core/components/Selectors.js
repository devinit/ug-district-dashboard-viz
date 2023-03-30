/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ChartFilters from '../../components/ChartFilters';
import Select from '../../components/Select';
import fetchData from '../../utils/data';

const Selectors = (props) => {
  const [selectors, setSelectors] = useState([]);

  useEffect(() => {
    if (props.configs) {
      Promise.all(
        props.configs.map(async (selector) => {
          const item = {
            label: selector.label,
            defaultValue: selector.defaultValue,
            config: selector,
          };
          item.options = selector.defaultValue ? [selector.defaultValue] : [];
          let data = selector.data || [];
          if (selector.url) {
            data = await fetchData(selector.url);
          }
          item.options = item.options.concat(
            data.reduce((options, curr) => {
              if (!options.find((i) => i[selector.valueProperty] === curr[selector.valueProperty])) {
                options.push({
                  value: curr[selector.valueProperty],
                  label: curr[selector.labelProperty],
                });
              }

              return options;
            }, [])
          );

          return item;
        })
      )
        .then(setSelectors)
        .catch((error) => window.console.log(error));
    }
  }, [props.configs]);
  const selectErrorMessage = '';

  return (
    <ChartFilters selectErrorMessage={selectErrorMessage}>
      {selectors.map((selector) => {
        const { label, options, defaultValue } = selector;

        return (
          <Select
            key={label}
            label={label}
            options={options}
            classNamePrefix="subcounty-filter sticky-top"
            isClearable={false}
            defaultValue={[{ ...defaultValue, isCloseable: true }]}
            onChange={(item) => props.onChange(selector, item)}
            css={{ minWidth: '200px' }}
          />
        );
      })}
    </ChartFilters>
  );
};

Selectors.propTypes = {
  configs: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      label: PropTypes.string.isRequired,
      defaultValue: PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }),
      labelProperty: PropTypes.string.isRequired,
      valueProperty: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func,
};

export default Selectors;
