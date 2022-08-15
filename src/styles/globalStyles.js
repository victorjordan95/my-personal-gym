import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.colors.backgroundColor};
    font-family: Open-Sans, Helvetica, Sans-Serif;
  }

  .ant-breadcrumb {
    display: none;
    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      display: block;
      margin-bottom: 36px;
    }
  }

  .ant-dropdown {
    min-width: 100px!important;
  }

  .table-point {
    .ant-table-row {
      cursor: pointer;
    }
  }
`;

export default GlobalStyle;
