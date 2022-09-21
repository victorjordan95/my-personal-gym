import { Tabs } from 'antd';
import styled from 'styled-components';

export const WorkoutTab = styled(Tabs)`
  .ant-tabs-nav {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: start;
    margin-bottom: 8px;
    margin-top: 8px;
    .ant-tabs-extra-content {
      margin-top: 8px;
    }

    .ant-btn {
      align-items: center;
      display: flex;
      justify-content: center;
      width: 100%;

      svg {
        margin-right: 8px;
      }
    }

    @media (min-width: 1440px) {
      flex-flow: row;
    }
  }
  @media (max-width: 768px) {
    .ant-tabs-extra-content {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      margin: 8px 0;
      width: 100%;

      .ant-space {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        width: 100%;

        &-item {
          width: calc(50% - 8px);
        }
      }
    }

    .ant-collapse {
      left: -24px;
      position: relative;
      width: calc(100% + 48px);
    }

    .ant-tabs-nav-list {
      margin-bottom: 24px;
    }
  }
  .actions-btn {
    margin-bottom: 24px;
    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
      text-align: right;
    }
  }

  .ant-collapse-content-box {
    padding: 0;
  }
`;
