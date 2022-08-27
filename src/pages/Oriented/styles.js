import styled from 'styled-components';

export const CardContainer = styled.div`
  background-color: ${(props) => props.theme.colors.light};
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  height: calc(100% - 72px);

  .ant-page-header-footer {
    .ant-tabs {
      height: 100%;
    }
  }
`;
