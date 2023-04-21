import styled from '@emotion/styled';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ErrorMessage = styled.div`
  color: red;
  font-size: 11px;
  position: relative;
  padding: 5px 5px 5px 0px;
  display: block;
`;

const ChartFilters = (props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const onError = (error) => {
    if (!error) {
      setErrorMessage('');

      return;
    }
    if (error.type === 'maxSelectedOptions') {
      setErrorMessage(props.selectErrorMessage);
    }
  };

  return (
    <div className={classNames(props.className)}>
      {React.Children.map(props.children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { onError }) : child
      )}
      {errorMessage ? <ErrorMessage className="data-selector--wrapper">{errorMessage}</ErrorMessage> : null}
    </div>
  );
};

ChartFilters.propTypes = {
  selectErrorMessage: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ChartFilters;
