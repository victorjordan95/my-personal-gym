import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { auth, db } from '../../../config/firebase';

import userContext from '../../../contexts/userContext';

import CrudService from '../../../services/CrudService';
import { errorHandler } from '../../../utils/errorHandler';
import { successHandler } from '../../../utils/successHandler';

export function OrientedsForm({
  editForm,
  handleCloseModal,
  isEditable = true,
  setData,
  setEditForm,
  TABLE_DB_NAME,
  visible,
}) {
  const loggedUser = useContext(userContext);
  const [formValues, setFormValues] = useState({});
  const [trainers, setTrainers] = useState([]);

  const createData = async (values) => {
    try {
      CrudService.save(TABLE_DB_NAME, values);
      handleCloseModal();
      successHandler(
        'Registro salvo com sucesso. Você pode continuar adicionando outros registros.'
      );
      setData((prev) => [{ ...values }, ...prev]);
    } catch (error) {
      errorHandler(error);
    }
  };

  const registerWithEmailAndPassword = async (values) => {
    const { email, name } = values;
    const role = 'ORIENTED';
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        'PERSONALTRAINER'
      );
      const { user } = res;
      await addDoc(collection(db, TABLE_DB_NAME), {
        uid: user.uid,
        name,
        role,
        email,
        trainerId: loggedUser.id,
      });
      createData(values);
    } catch (err) {
      errorHandler(err.message);
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
      registerWithEmailAndPassword(values);
    }
    setEditForm({});
  };

  const getTrainers = async () => {
    try {
      const data = await CrudService.getAll('users');
      const tr = data.filter((user) => user.role === 'TRAINER');
      setTrainers(tr);
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    setFormValues(editForm);
    getTrainers();
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
          label="Treinador"
          name="trainer"
          rules={[
            { required: true, message: 'Informe o treinador do usuário!' },
          ]}
        >
          <Select placeholder="Selecione uma opção">
            {trainers.map((trainer) => (
              <Select.Option key={trainer.id} value={trainer.id}>
                {trainer.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

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
