import { Button, PageHeader, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CrudService from '../../services/CrudService';
import { OrientedsForm } from './OrientedsForm';

const TABLE_DB_NAME = 'orienteds';

export function Orienteds() {
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({});
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  const remove = (record) => {
    CrudService.delete(TABLE_DB_NAME, record.id);
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
    const dataList = await CrudService.getAll(TABLE_DB_NAME);
    setData(dataList);
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sortDirections: ['descend'],
    },
    {
      title: 'Peso',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Altura',
      dataIndex: 'height',
      key: 'height',
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
      title="Alunos"
      subTitle="Lista de alunos"
      extra={[
        <Button type="primary" onClick={showDrawer}>
          Cadastrar novo
        </Button>,
      ]}
    >
      <Table
        dataSource={data}
        columns={columns}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/orientados/${record.id}`);
          },
        })}
      />

      <OrientedsForm
        editForm={editForm}
        handleCloseModal={handleCloseModal}
        setEditForm={setEditForm}
        visible={visible}
        TABLE_DB_NAME={TABLE_DB_NAME}
      />
    </PageHeader>
  );
}
