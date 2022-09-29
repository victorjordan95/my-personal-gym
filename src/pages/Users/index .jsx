import { Button, PageHeader, Space, Switch, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../constants/roles';

import Loader from '../../components/Loader';

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

  const [data, setData] = useState([]);
  const [editForm, setEditForm] = useState();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleUser = (checked, record) => {
    try {
      CrudService.update(TABLE_DB_NAME, record.id, { active: checked });
      successHandler(
        `Usuário ${record.name} ${
          checked ? 'ativado' : 'desativado'
        } com sucesso!`
      );
      setData(
        data.map((item) => {
          if (item.id === record.id) {
            return { ...item, active: checked };
          }
          return item;
        })
      );
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
    setIsLoading(true);
    try {
      const fetchedData = await CrudService.getAll(TABLE_DB_NAME);
      setData(fetchedData);
    } catch (error) {
      errorHandler(error.message);
    }
    setIsLoading(false);
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '50px',
      render: (_, record) => (
        <Switch
          checked={record.active}
          onChange={(checked) => toggleUser(checked, record)}
        />
      ),
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
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
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

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
