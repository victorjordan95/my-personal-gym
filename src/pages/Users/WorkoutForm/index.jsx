import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';

import { auth } from '../../../config/firebase';
import CrudService from '../../../services/CrudService';
import { errorHandler } from '../../../utils/errorHandler';
import { successHandler } from '../../../utils/successHandler';

export function WorkoutForm({
  editForm,
  handleCloseModal,
  setEditForm,
  setData,
  TABLE_DB_NAME,
  visible,
}) {
  const [form] = Form.useForm();

  const registerWithEmailAndPassword = async (values) => {
    const { email, name, role } = values;
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        'PERSONALTRAINER'
      );
      const { user } = res;
      CrudService.save(`${TABLE_DB_NAME}`, {
        uid: user.uid,
        name,
        role,
        email,
      });
      setData((prev) => [{ name, email, role }, ...prev]);
      successHandler(
        'Registro salvo com sucesso. Você pode continuar adicionando outros registros.',
        'topLeft'
      );
    } catch (err) {
      errorHandler(err.message);
    }
  };

  const onFinish = async (values) => {
    registerWithEmailAndPassword(values);
    setEditForm({});
  };

  useEffect(() => {
    if (editForm?.id) {
      form.setFieldsValue(editForm);
    } else {
      form.setFieldsValue({
        name: '',
        role: '',
        email: '',
      });
    }
  }, [editForm]);

  return (
    <Drawer
      closable
      key="right"
      onClose={handleCloseModal}
      placement="right"
      title="Cadastro de usuário"
      visible={visible}
    >
      <Form form={form} hideRequiredMark layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, message: 'Informe o nome do usuário!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="role"
          rules={[{ required: true, message: 'Informe o tipo do usuário!' }]}
        >
          <Select placeholder="Selecione uma opção">
            <Select.Option value="ADMIN">Administrador</Select.Option>
            <Select.Option value="TRAINER">Treinador</Select.Option>
            <Select.Option value="ORIENTED">Aluno</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, message: 'Informe o e-mail do usuário!' }]}
        >
          <Input type="email" />
        </Form.Item>

        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button htmlType="submit" type="primary">
            Salvar
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}
