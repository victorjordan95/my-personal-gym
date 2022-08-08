import { Button, PageHeader, Space, Table } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import userContext from '../../contexts/userContext';

import CrudService from '../../services/CrudService';
import { errorHandler } from '../../utils/errorHandler';
import { OrientedsForm } from './OrientedsForm';

export function Orienteds() {
  const navigate = useNavigate();
  const user = useContext(userContext);

  const [editForm, setEditForm] = useState({});
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const TABLE_DB_NAME = `orienteds`;

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
    const idLocalStorage = JSON.parse(
      localStorage.getItem('@personal-gym')
    )?.id;
    const userId = user?.user?.id || idLocalStorage;
    try {
      const dataList = await CrudService.getAll(TABLE_DB_NAME);
      const myOrienteds = dataList.filter((item) => item.trainerId === userId);
      setData(myOrienteds);
    } catch (error) {
      errorHandler(error);
    }
    setIsLoading(false);
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

  if (isLoading) {
    return <Loader />;
  }

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
        setData={setData}
        TABLE_DB_NAME={TABLE_DB_NAME}
      />
    </PageHeader>
  );
}
