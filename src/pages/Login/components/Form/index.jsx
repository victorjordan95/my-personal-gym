import { Button, Form, Input } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import logoImg from '../../../../assets/images/logo.png';
import { auth } from '../../../../config/firebase';
import userContext from '../../../../contexts/userContext';
import CrudService from '../../../../services/CrudService';
import { isOriented } from '../../../../utils/checkRoles';
import { errorHandler } from '../../../../utils/errorHandler';
import * as S from '../../styles';

export function FormLogin({ className }) {
  const user = useContext(userContext);
  const navigate = useNavigate();

  const handleNavigateByRole = ({ role, id }) => {
    if (isOriented(role)) {
      navigate(`/orientados/${id}`);
      return;
    }
    navigate('/inicio');
  };

  const getUserInfo = async (userData) => {
    try {
      const users = await CrudService.getAll('users');
      const us = users.find((u) => u.uid === userData.id);
      const saveData = { ...us, ...userData, bdId: us.id };
      localStorage.setItem('@personal-gym', JSON.stringify(saveData));
      user.handleUserContext(saveData);
      handleNavigateByRole({ role: us.role, id: us.id });
    } catch (error) {
      errorHandler(error);
    }
  };

  const logInWithEmailAndPassword = async ({ email, password }) => {
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        id: resp.user.uid,
        email: resp.user.email,
        token: resp.user.accessToken,
        dispayName: resp.user.displayName,
      };
      getUserInfo(userData);
    } catch (err) {
      errorHandler(err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    errorHandler(errorInfo);
  };

  useEffect(() => {
    auth.onAuthStateChanged((loggedUser) => {
      if (loggedUser) {
        getUserInfo({
          id: loggedUser.uid,
        });
      }
    });
  }, []);

  return (
    <S.FormContainer>
      <img src={logoImg} alt="Logo" />
      <Form
        className={className}
        layout="vertical"
        initialValues={{ remember: true }}
        name="basic"
        onFinish={logInWithEmailAndPassword}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, message: 'Insira seu e-mail cadastrado!' }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Insira sua senha!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </S.FormContainer>
  );
}
