import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect } from 'react';

import CrudService from '../../../services/CrudService';
import { errorHandler } from '../../../utils/errorHandler';
import { successHandler } from '../../../utils/successHandler';

export function WorkoutForm({
  editForm,
  handleCloseModal,
  setEditForm,
  setWorkouts,
  TABLE_DB_NAME,
  visible,
}) {
  const [form] = Form.useForm();

  const createData = async (values) => {
    try {
      CrudService.save(TABLE_DB_NAME, {
        ...values,
        url_video: values.url_video || '',
      });
      form.resetFields();
      setWorkouts((prev) => [values, ...prev]);
      successHandler(
        'Registro salvo com sucesso. Você pode continuar adicionando outros registros.',
        'topLeft'
      );
    } catch (error) {
      errorHandler(error);
    }
  };

  const updateData = async (values) => {
    try {
      CrudService.update(TABLE_DB_NAME, editForm?.id, values);
      successHandler('Registro atualizado com sucesso.');
      handleCloseModal();
    } catch (error) {
      errorHandler(error);
    }
  };

  const onFinish = async (values) => {
    if (editForm?.id) {
      updateData(values);
    } else {
      createData(values);
    }
    setEditForm({});
  };

  useEffect(() => {
    if (editForm?.id) {
      form.setFieldsValue(editForm);
    } else {
      form.setFieldsValue({
        name: '',
        type: '',
        url_video: '',
      });
    }
  }, [editForm]);

  return (
    <Drawer
      closable
      key="right"
      onClose={handleCloseModal}
      placement="right"
      title="Cadastro de exercício"
      visible={visible}
    >
      <Form form={form} hideRequiredMark layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, message: 'Informe o nome do exercício!' }]}
        >
          <Input type="search" />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="type"
          rules={[{ required: true, message: 'Informe o tipo do exercício!' }]}
        >
          <Select placeholder="Selecione uma opção">
            <Select.Option value="ABDOMEM">Abdomem</Select.Option>
            <Select.Option value="BICEPS">Bíceps</Select.Option>
            <Select.Option value="COSTAS">Costas</Select.Option>
            <Select.Option value="OMBROS">Ombros</Select.Option>
            <Select.Option value="PEITO">Peito</Select.Option>
            <Select.Option value="PERNA">Perna</Select.Option>
            <Select.Option value="TRICEPS">Tríceps</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="URL Vídeo Exercício" name="url_video">
          <Input type="url" initialValues="" />
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
