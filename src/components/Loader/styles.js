import styled from 'styled-components';

export const Loader = styled.div`
  align-items: center;
  background: rgb(0 0 0 / 37%);
  display: flex;
  height: 100%;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 99;

  svg {
    width: 290px !important;
  }
`;
