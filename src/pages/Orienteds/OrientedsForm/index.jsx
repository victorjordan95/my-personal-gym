import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';

import CrudService from '../../../services/CrudService';
import { errorHandler } from '../../../utils/errorHandler';
import { successHandler } from '../../../utils/successHandler';

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
      successHandler(
        'Registro salvo com sucesso. Você pode continuar adicionando outros registros.'
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
