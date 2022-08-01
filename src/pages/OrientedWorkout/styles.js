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

    .ant-tabs-nav-list {
      margin-bottom: 24px;
    }
  }
`;
