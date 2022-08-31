import { Tabs } from 'antd';
import styled from 'styled-components';

export const WorkoutTab = styled(Tabs)`
  @media (max-width: 768px) {
    .ant-tabs-nav {
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: start;
      margin-top: 8px;
    }

    .ant-tabs-extra-content {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;

      .ant-space {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;

        &-item {
          width: calc(50% - 8px);
          button {
            width: 100%;
          }
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
