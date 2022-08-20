import { Layout } from 'antd';
import styled from 'styled-components';

export const AppLayout = styled(Layout)`
  display: grid;
  margin: 0 auto;
  grid-template-columns: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 80px auto;
  }
`;

export const Container = styled(Layout)`
  min-height: calc(100vh - 60px);
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-height: 100vh;
    min-height: 100vh;
    overflow-y: scroll;
  }
`;

export const Wrapper = styled(Layout.Content)`
  background-color: ${({ theme }) => theme.colors.backgroundColor};
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: contain;
  padding: 24px;
  max-width: 100vw;
  max-height: calc(100vh - 60px);

  .ant-table-content {
    overflow-x: auto;
    max-width: calc(100vw - 32px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: calc(100vh);
    padding: 48px 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 36px;
  }
`;
