import styled from 'styled-components';
import { Layout } from 'antd';

export const AppLayout = styled(Layout)`
  display: grid;
  margin: 0 auto;
  grid-template-columns: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 80px auto;
  }
`;

export const Container = styled(Layout)`
  min-height: calc(100vh - 60px);
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: 100vh;
    min-height: 100vh;
    overflow: scroll;
  }
`;

export const Wrapper = styled(Layout.Content)`
  background-color: ${({ theme }) => theme.colors.backgroundColor};
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: contain;
  padding: 24px;
  max-width: 100vw;
  overflow-y: scroll;
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
    padding: 60px 37px;
  }
`;

export const MobileMenu = styled.nav`
  background: ${({ theme }) => theme.colors.primary.main};
  bottom: 0;
  color: #fff;
  display: flex;
  height: 60px;
  justify-content: space-between;
  padding: 8px 16px;
  position: fixed;
  width: 100vw;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const MobileMenuItem = styled.div`
  text-align: center;
  font-size: 12px;

  svg {
    height: 24px;
    width: 24px;
  }
`;
