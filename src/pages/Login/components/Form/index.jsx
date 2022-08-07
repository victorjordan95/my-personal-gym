import { Button, Checkbox, Form, Input } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { errorHandler } from '../../../../utils/errorHandler';
import { auth } from '../../../../config/firebase';
import userContext from '../../../../contexts/userContext';

export function FormLogin({ className }) {
  const user = useContext(userContext);
  const navigate = useNavigate();

  const logInWithEmailAndPassword = async ({ email, password }) => {
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        id: resp.user.uid,
        email: resp.user.email,
        token: resp.user.accessToken,
        dispayName: resp.user.displayName,
      };
      user.handleUserContext(userData);
      localStorage.setItem('@personal-gym', JSON.stringify(userData));
      navigate('/treinos');
    } catch (err) {
      console.error(err);
      errorHandler(err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      autoComplete="off"
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
        rules={[{ required: true, message: 'Insira sua senha!!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Entrar
        </Button>
      </Form.Item>
    </Form>
  );
}
