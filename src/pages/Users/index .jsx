import { Button, PageHeader, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../constants/roles';

import CrudService from '../../services/CrudService';
import { errorHandler } from '../../utils/errorHandler';
import { successHandler } from '../../utils/successHandler';
import { UserForm } from './UserForm';

const TABLE_DB_NAME = 'users';
const ROLES_TEXT = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.TRAINER]: 'Personal Trainer',
  [ROLES.ORIENTED]: 'Aluno',
};

export function Users() {
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  const remove = (record) => {
    try {
      CrudService.delete(TABLE_DB_NAME, record.id);
      setData((prev) => prev.filter((item) => item.id !== record.id));
      successHandler();
    } catch (error) {
      errorHandler(error.message);
    }
  };

  const showDrawer = (record) => {
    setEditForm(record);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setEditForm({});
    setVisible(false);
  };

  const getData = async () => {
    const fetchedData = await CrudService.getAll(TABLE_DB_NAME);
    setData(fetchedData);
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend'],
    },
    {
      title: 'Tipo usuário',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <span>{ROLES_TEXT[text]}</span>,
    },
    {
      title: 'Ação',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showDrawer(record)}>
            Editar
          </Button>
          <Button danger onClick={() => remove(record)}>
            Remover
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageHeader
      ghost={false}
      onBack={() => navigate(-1)}
      title="Usuários"
      subTitle="Lista de usuários cadastrados"
      extra={[
        <Button type="primary" onClick={showDrawer}>
          Cadastrar novo
        </Button>,
      ]}
    >
      <Table dataSource={data} columns={columns} />

      <UserForm
        editForm={editForm}
        handleCloseModal={handleCloseModal}
        setData={setData}
        setEditForm={setEditForm}
        TABLE_DB_NAME={TABLE_DB_NAME}
        visible={visible}
      />
    </PageHeader>
  );
}
