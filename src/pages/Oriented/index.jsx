/* eslint-disable no-unused-vars */
import {
  Button,
  Descriptions,
  PageHeader,
  Space,
  Statistic,
  Table,
  Tabs,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';

import CrudService from '../../services/CrudService';
import { OrientedsForm } from '../Orienteds/OrientedsForm';

import * as S from './styles';
import { TableWorkout } from './TableWorkout';

const { TabPane } = Tabs;

function OrientedWorkouts() {
  return <p>tab1</p>;
}

const TABLE_DB_NAME = `orienteds`;
export function Oriented() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({});
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const singleData = await CrudService.getById(TABLE_DB_NAME, id);
    setEditForm(singleData);
    setData(singleData);
    setIsLoading(false);
  };

  const redirectWorkouts = () => {
    navigate(`/orientados/${id}/treino`, {
      state: { name: data.name, id },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <S.CardContainer>
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={data?.name}
        subTitle={data?.profession}
        extra={[
          <>
            <Button key="1" type="primary" onClick={redirectWorkouts}>
              Treino
            </Button>
            <Button key="1" type="secondary" onClick={showDrawer}>
              Formulário
            </Button>
          </>,
        ]}
        footer={
          <Tabs defaultActiveKey="1">
            <TabPane tab="Details" key="1">
              <TableWorkout />
            </TabPane>
            <TabPane tab="Rule" key="2">
              <OrientedWorkouts />
            </TabPane>
          </Tabs>
        }
      >
        <div className="content">
          <div className="main">
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="Peso">
                {data?.weight} kg
              </Descriptions.Item>
              <Descriptions.Item label="Objetivo">
                {data?.goal}
              </Descriptions.Item>

              <Descriptions.Item label="Altura">
                {data?.height} m
              </Descriptions.Item>
              <Descriptions.Item label="Início">
                {data?.createdAt?.toDate().toLocaleDateString('en-GB')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </PageHeader>
      <OrientedsForm
        editForm={editForm}
        handleCloseModal={handleCloseModal}
        setEditForm={setEditForm}
        visible={visible}
        TABLE_DB_NAME={TABLE_DB_NAME}
        isEditable={false}
      />
    </S.CardContainer>
  );
}
