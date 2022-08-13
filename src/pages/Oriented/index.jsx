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
import { Timestamp } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { ROLES } from '../../constants/roles';
import userContext from '../../contexts/userContext';

import CrudService from '../../services/CrudService';
import { checkRedirectUser } from '../../utils/checkRedirectUser';
import { errorHandler } from '../../utils/errorHandler';
import { isMe } from '../../utils/isMe';
import { successHandler } from '../../utils/successHandler';
import { OrientedsForm } from '../Orienteds/OrientedsForm';
import { EvolutionOriented } from './EvolutionOriented';

import * as S from './styles';

const { TabPane } = Tabs;

const TABLE_DB_NAME = `users`;
export function Oriented() {
  const { id } = useParams();
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({});
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const remove = (record) => {
    CrudService.delete(TABLE_DB_NAME, record.id);
  };

  const getData = async () => {
    const singleData = await CrudService.getById(TABLE_DB_NAME, id);
    setEditForm(singleData);
    setData(singleData);
    setIsLoading(false);
  };

  const showDrawer = (record) => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const redirectWorkouts = () => {
    navigate(`/orientados/${id}/treino`, {
      state: { name: data.name, id },
    });
  };

  const calculateValidDateWorkout = (date) => {
    const weeks = editForm.amountOfWeeks;
    const dateWorkout = date.toDate();
    const dateWorkoutPlusWeeks = new Date(
      dateWorkout.setDate(dateWorkout.getDate() + Number(weeks) * 7)
    );
    return dateWorkoutPlusWeeks.toLocaleDateString('pt-BR');
  };

  const notifyWorkout = async () => {
    try {
      const resp = await CrudService.update(TABLE_DB_NAME, editForm?.id, {
        ...editForm,
        hasNewWorkout: true,
        newWorkoutDate: Timestamp.now(),
      });
      setEditForm(resp);
      successHandler('Treino notificado com sucesso!');
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    const canFetch = checkRedirectUser({
      navigate,
      role: user?.role,
      id,
      bdId: user?.bdId,
    });
    if (canFetch) {
      getData();
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <S.CardContainer>
      <PageHeader
        className="site-page-header-responsive"
        title={data?.name}
        subTitle={data?.profession}
        extra={[
          <>
            {user?.role !== ROLES.ORIENTED && (
              <Button key="1" type="primary" onClick={notifyWorkout}>
                Notificar treino
              </Button>
            )}
            <Button key="2" type="primary" onClick={redirectWorkouts}>
              Treino
            </Button>
            <Button key="3" type="secondary" onClick={showDrawer}>
              Formulário
            </Button>
          </>,
        ]}
        footer={
          <Tabs defaultActiveKey="1">
            <TabPane tab="Evolução peso" key="1">
              <EvolutionOriented />
            </TabPane>
          </Tabs>
        }
      >
        <div className="content">
          <div className="main">
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="Peso inicial">
                {data?.weight} kg
              </Descriptions.Item>
              <Descriptions.Item label="Objetivo">
                {data?.goal}
              </Descriptions.Item>

              <Descriptions.Item label="Altura">
                {data?.height} m
              </Descriptions.Item>
              <Descriptions.Item label="Início">
                {data?.createdAt?.toDate().toLocaleDateString('pt-BR')}
              </Descriptions.Item>
              <Descriptions.Item label="Treino criado em">
                {data?.newWorkoutDate?.toDate().toLocaleDateString('pt-BR')}
              </Descriptions.Item>
              <Descriptions.Item label="Treino válido até">
                {calculateValidDateWorkout(data?.newWorkoutDate)}
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
        isEditable={isMe(id, user.bdId)}
      />
    </S.CardContainer>
  );
}
