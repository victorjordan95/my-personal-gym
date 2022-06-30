import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { Timestamp } from 'firebase/firestore';

import CrudService from '../../../services/CrudService';
import { errorHandler } from '../../../utils/errorHandler';
import { successHandler } from '../../../utils/successHandler';

export function WorkoutForm({
  visible,
  handleCloseModal,
  editForm,
  setEditForm,
  TABLE_DB_NAME,
}) {
  const createData = async (values) => {
    try {
      CrudService.save(TABLE_DB_NAME, {
        ...values,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      handleCloseModal();
      successHandler(
        'Registro salvo com sucesso. Você pode continuar adicionando outros registros.'
      );
    } catch (error) {
      errorHandler(error);
    }
  };

  const updateData = async (values) => {
    try {
      CrudService.update(TABLE_DB_NAME, editForm.id, {
        ...values,
        updatedAt: Timestamp.now(),
      });
      successHandler('Registro atualizado com sucesso.');
      handleCloseModal();
    } catch (error) {
      errorHandler(error);
    }
  };

  const onFinish = async (values) => {
    if (editForm.id) {
      updateData(values);
    } else {
      createData(values);
    }
    setEditForm({});
  };

  return (
    <Drawer
      closable
      key="right"
      onClose={handleCloseModal}
      placement="right"
      title="Cadastro de exercício"
      visible={visible}
    >
      <Form
        hideRequiredMark
        initialValues={{ ...editForm }}
        layout="vertical"
        onFinish={onFinish}
      >
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
          initialValue="PEITO"
        >
          <Select placeholder="Selecione uma opção" defaultActiveFirstOption>
            <Select.Option value="PEITO">Peito</Select.Option>
            <Select.Option value="PERNA">Perna</Select.Option>
            <Select.Option value="BICEPS">Bíceps</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="URL Vídeo Exercício" name="url_video">
          <Input type="url" />
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
