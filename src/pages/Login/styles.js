import styled from 'styled-components';
import bgImage from '../../assets/images/login-bg.jpeg';

export const Container = styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .form-login {
    width: 100%;
  }

  .ant-row {
    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
      width: 100%;
    }
  }
`;

export const FormContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column wrap;
  padding: 24px;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    justify-content: center;
    width: 40%;
  }

  img {
    width: 150px;
    margin-bottom: 48px;
  }

  .ant-btn {
    height: 40px;
    width: 100%;
  }
`;

export const Background = styled.div`
  display: none;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    background-image: url(${bgImage});
    background-position: right;
    background-size: cover;
    display: block;
    height: 100vh;
    width: 60%;
  }
`;
