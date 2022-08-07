import Sider from 'antd/lib/layout/Sider';
import styled from 'styled-components';

export const AppSider = styled(Sider)`
  border-radius: 0;
  display: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: initial;
  }

  .logo {
    fill: ${(props) => props.theme.colors.secondary.main};
    width: 48px;
    margin: 48px auto 0;
  }

  div.ant-layout-sider-children {
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;

    .ant-menu {
      margin: auto 0;
      position: relative;
      bottom: 48px;
    }

    .ant-menu-item {
      padding-left: 16px !important;
      margin-bottom: 24px;
      svg {
        height: 45px;
        width: 45px;
      }
      &:nth-child(2) {
        svg {
          height: 35px;
          margin-left: 5px;
          width: 35px;
        }
      }
    }

    .ant-menu-item-selected {
      background-color: transparent !important;
      svg {
        color: ${(props) => props.theme.colors.secondary.main};
      }
    }
  }

  .app-sider__logout {
    color: ${(props) => props.theme.colors.light};
    cursor: pointer;
    margin-bottom: 24px;
    text-align: center;
    transition: all 0.3s ease-in-out;
    width: 100%;

    &:hover {
      color: ${(props) => props.theme.colors.secondary.main};
    }

    svg {
      height: 45px;
      width: 45px;
    }
  }
`;
