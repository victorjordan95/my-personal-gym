import { Button, PageHeader, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoLinkExternal } from 'react-icons/go';

import CrudService from '../../services/CrudService';
import { WorkoutForm } from './WorkoutForm';
import locales from '../../constants/locales';

const TABLE_DB_NAME = 'workouts';

export function Workouts() {
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState();
  const [visible, setVisible] = useState(false);
  const [workouts, setWorkouts] = useState([]);

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

  const getWorkouts = async () => {
    const works = await CrudService.getAll(TABLE_DB_NAME);
    setWorkouts(works);
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tipo de exercício',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Abdomem', value: 'ABDOMEM' },
        { text: 'Bíceps', value: 'BICEPS' },
        { text: 'Costas', value: 'COSTAS' },
        { text: 'Ombros', value: 'OMBROS' },
        { text: 'Peito', value: 'PEITO' },
        { text: 'Perna', value: 'PERNA' },
        { text: 'Tríceps', value: 'TRICEPS' },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.type.startsWith(value),
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'URL vídeo',
      dataIndex: 'url_video',
      key: 'url_video',
      render: (text) =>
        text?.length > 0 ? (
          <a href={text} target="_blank" rel="noreferrer">
            <GoLinkExternal style={{ position: 'relative', top: '2px' }} />{' '}
            Acessar vídeo
          </a>
        ) : (
          'Sem vídeo cadastrado'
        ),
      filters: [
        { text: 'Com vídeo', value: true },
        { text: 'Sem vídeo', value: false },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {
        if (value) {
          return record.url_video?.length > 0;
        }
        return !record.url_video;
      },
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
    getWorkouts();
  }, []);

  return (
    <PageHeader
      ghost={false}
      onBack={() => navigate(-1)}
      title="Exercícios"
      subTitle="Lista de exercícios cadastrados"
      extra={[
        <Button type="primary" onClick={showDrawer}>
          Cadastrar novo
        </Button>,
      ]}
    >
      <Table dataSource={workouts} columns={columns} locale={locales.table} />

      <WorkoutForm
        editForm={editForm}
        handleCloseModal={handleCloseModal}
        setEditForm={setEditForm}
        setWorkouts={setWorkouts}
        visible={visible}
        TABLE_DB_NAME={TABLE_DB_NAME}
      />
    </PageHeader>
  );
}
