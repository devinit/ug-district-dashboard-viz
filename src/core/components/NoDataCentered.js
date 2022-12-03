import styled from '@emotion/styled';
import React from 'react';
import NoData from '../../components/NoData';

const StyledWrapper = styled.div`
  background: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

const NoDataCentered = () => (
  <StyledWrapper>
    <NoData />
  </StyledWrapper>
);

export default NoDataCentered;
