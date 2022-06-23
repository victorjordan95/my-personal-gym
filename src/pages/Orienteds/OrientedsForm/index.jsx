import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Space,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';

import CrudService from '../../../services/CrudService';

export function OrientedsForm({
  visible,
  handleCloseModal,
  editForm,
  setEditForm,
  TABLE_DB_NAME,
  isEditable = true,
}) {
  const [formValues, setFormValues] = useState({});

  const createData = async (values) => {
    try {
      CrudService.save(TABLE_DB_NAME, values);
      handleCloseModal();
      notification.success({
        message: 'Sucesso',
        description:
          'Registro salvo com sucesso. Você pode continuar adicionando outros registros.',
        duration: 4.5,
      });
    } catch (error) {
      notification.error({
        message: 'Ocorreu um erro',
        description: error.message,
        duration: 4.5,
      });
    }
  };

  const updateData = async (values) => {
    try {
      CrudService.update(TABLE_DB_NAME, editForm.id, values);
      notification.success({
        message: 'Sucesso',
        description: 'Registro atualizado com sucesso.',
        duration: 4.5,
      });
      handleCloseModal();
    } catch (error) {
      notification.error({
        message: 'Ocorreu um erro',
        description: error.message,
        duration: 4.5,
      });
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

  useEffect(() => {
    console.log('chegou valor', editForm);
    setFormValues(editForm);
  }, [editForm]);

  return (
    <Drawer
      closable
      key="right"
      onClose={handleCloseModal}
      placement="right"
      title="Cadastro de aluno"
      visible={visible}
    >
      <Form
        hideRequiredMark
        initialValues={{ ...formValues }}
        layout="vertical"
        onFinish={onFinish}
        disabled={!isEditable}
      >
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, message: 'Informe o nome do aluno!' }]}
        >
          <Input type="search" />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Peso"
              name="weight"
              rules={[{ required: true, message: 'Informe o peso do aluno!' }]}
            >
              <InputNumber placeholder="55.5" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Altura"
              name="height"
              rules={[
                { required: true, message: 'Informe a altura do aluno!' },
              ]}
            >
              <InputNumber placeholder="1.70" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Objetivo"
          name="goal"
          rules={[{ required: true, message: 'Informe o objetivo do aluno!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Profissão"
          name="profession"
          rules={[{ required: true, message: 'Informe a profissão do aluno!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Possui dores articulares" name="pains">
          <Radio.Group value="horizontal">
            <Radio.Button value="YES">Sim</Radio.Button>
            <Radio.Button value="NO">Não</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Já realizou cirurgia? Qual?" name="surgery">
          <Input />
        </Form.Item>

        <Form.Item label="Uso contínuo de medicamento? Qual?" name="medication">
          <Input />
        </Form.Item>

        <Form.Item label="Doenças crônicas" name="diseases">
          <Input />
        </Form.Item>

        <Form.Item label="Informação extra" name="extraInformation">
          <TextArea rows={4} disabled={!isEditable} />
        </Form.Item>

        {isEditable && (
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button htmlType="submit" type="primary">
              Salvar
            </Button>
          </Space>
        )}
      </Form>
    </Drawer>
  );
}
