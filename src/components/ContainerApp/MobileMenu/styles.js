import { Drawer } from 'antd';
import styled from 'styled-components';

export const MobileMenu = styled.nav`
  background: ${({ theme }) => theme.colors.primary.main};
  bottom: 0;
  color: #fff;
  display: flex;
  height: 60px;
  justify-content: space-between;
  padding: 8px 24px;
  position: fixed;
  width: 100vw;
  z-index: 999;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const MobileMenuItem = styled.div`
  color: ${(props) =>
    props.isActive ? props.theme.colors.secondary.main : '#fff'};
  font-size: 12px;
  text-align: center;

  svg {
    height: 24px;
    width: 24px;
  }
`;

export const MobileMenuDrawer = styled(Drawer)`
  .ant-drawer-body {
    display: flex;
    flex-flow: column wrap;
    padding: 0;
  }
`;

export const MenuLink = styled.div`
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  border-top: ${({ isLast }) => (isLast ? '1px solid #f0f0f0' : 'transparent')};
  background: ${({ isLast }) => (isLast ? '#f9f9f9' : 'transparent')};
  color: ${({ theme }) => theme.colors.secondary.main};
  display: flex;
  flex-flow: row nowrap;
  font-size: 16px;
  margin-top: ${({ isLast }) => (isLast ? 'auto' : '0')};
  padding: 12px 24px;

  svg {
    margin-right: 12px;
    font-size: 24px;
  }

  /* &:hover {

  } */

  span {
    color: ${({ theme }) => theme.colors.clickableText};
  }
`;
