/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import { Breadcrumb, Button, Col, Row, Space, Tabs } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../../components/Loader';
import { workoustIds } from '../../constants/workoutsNamesById';
import CrudService from '../../services/CrudService';
import { errorHandler } from '../../utils/errorHandler';
import { WorkoutTableForm } from './OrientedWorkoutForm';

import { ROLES } from '../../constants/roles';
import userContext from '../../contexts/userContext';
import { AnnotationModal } from './AnnotationModal';
import * as S from './styles';

const { TabPane } = Tabs;

export function OrientedWorkout() {
  const { id } = useParams();
  const { state } = useLocation();
  const userCon = useContext(userContext);
  const TABLE_DB_NAME = `users/${id}/treinos`;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [weeks, setWeeks] = useState([{ id: 1, name: 'Semana 1' }]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [activeWeek, setActiveWeek] = useState(1);
  const [user, setUser] = useState({ name: '', id: '' });
  const [workoutDescription, setWorkoutDescription] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const addWorkout = async () => {
    if (weeks.length === 0) return;

    const currentlyActiveWeek = workoutTypes.find(
      (week) => week.id === activeWeek
    );
    const currentlyActiveWeekIndex = workoutTypes.findIndex(
      (week) => week.id === activeWeek
    );
    const workoutsWeek = currentlyActiveWeek?.workouts;
    const length = workoutsWeek?.length || 0;
    const newData = {
      id: workoustIds[length + 1],
      name: workoustIds[length + 1],
      workouts: [],
    };

    if (currentlyActiveWeekIndex === -1) {
      const newWorkoutTypes = [
        {
          id: activeWeek,
          workouts: [...(workoutsWeek || []), newData],
        },
      ];
      setWorkoutTypes(newWorkoutTypes);
    } else {
      setWorkoutTypes([
        ...workoutTypes.slice(0, currentlyActiveWeekIndex),
        {
          ...workoutTypes[currentlyActiveWeekIndex],
          workouts: [
            ...(workoutTypes[currentlyActiveWeekIndex].workouts || []),
            newData,
          ],
        },
        ...workoutTypes.slice(currentlyActiveWeekIndex + 1),
      ]);
    }
  };

  async function getExercises(week) {
    const kindWorkouts = [
      ...new Set(week?.workouts.map((el) => el.workoutType)),
    ].sort();

    if (kindWorkouts.length === 0) {
      kindWorkouts.push('A');
    }

    const exercisesList = kindWorkouts.map((kindWorkout) => {
      const exerciceType = [];

      week?.workouts.forEach((exercise) => {
        if (exercise.workoutType === kindWorkout) {
          exerciceType.push(exercise);
        }
      });

      return {
        id: kindWorkout,
        name: kindWorkout,
        workouts: exerciceType || [],
      };
    });

    setWorkoutTypes((prevExer) => [
      ...prevExer,
      {
        id: week.id,
        workouts: [...exercisesList],
      },
    ]);
    setIsLoading(false);
  }

  const addWeek = async () => {
    let workouts = [];
    if (weeks.length > 0) {
      workouts = weeks[weeks.length - 1].workouts;
    }
    const newData = {
      id: uuidv4(),
      name: `Semana ${weeks.length + 1}`,
      workouts,
    };
    try {
      const weekId = await CrudService.save(TABLE_DB_NAME, newData);
      const newWeeks = [...weeks, { ...newData, id: weekId }];
      newWeeks.forEach((week) => {
        getExercises(week);
      });
      setWeeks(newWeeks);
      setActiveWeek(weekId);
    } catch (error) {
      errorHandler(error);
    }
  };

  async function getWeeks() {
    try {
      const weeksData = await CrudService.getAll(TABLE_DB_NAME);
      if (weeksData.length !== 0) {
        setWeeks(
          weeksData.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds)
        );
        setActiveWeek(weeksData[0].id);
        weeksData.forEach((week) => {
          getExercises(week);
        });
      } else {
        setWeeks([]);
        setIsLoading(false);
      }
    } catch (error) {
      if (
        error.message === "Cannot read properties of undefined (reading 'id')"
      ) {
        addWeek();
        setIsLoading(false);
        return;
      }
      errorHandler(error);
    }
  }

  const showAnnotationModal = () => {
    setIsModalVisible(true);
  };

  function handleChangeWeek(activeKey) {
    setActiveWeek(activeKey);
  }

  async function getUsername() {
    if (!state?.name) {
      const singleData = await CrudService.getById(TABLE_DB_NAME, id);
      setUser({ name: singleData.name, id: singleData.id });
      return;
    }

    setUser({ name: state.name, id: state.id });
  }

  function updateWeek(weekId, week) {
    const newWeeks = [...weeks];
    const index = newWeeks.findIndex((el) => el.id === weekId);
    newWeeks[index] = week;
    setWeeks(newWeeks);
  }

  function cleanWorkouts() {
    if (weeks.length === 0) return;

    setIsLoading(true);
    const promises = [];
    weeks.forEach((week) => {
      promises.push(CrudService.delete(TABLE_DB_NAME, week.id));
    });
    Promise.all(promises)
      .then(() => setWeeks([]))
      .catch((error) => errorHandler(error))
      .finally(() => setIsLoading(false));
  }

  async function getAnnotations() {
    try {
      const annotation = await CrudService.getAll(`users/${id}/annotations`);
      setWorkoutDescription(annotation[0]);
    } catch (error) {
      errorHandler(error);
    }
  }

  useEffect(() => {
    getUsername();
    getWeeks();
    getAnnotations();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/orientados/${user.id}`}>{user.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Treinos</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col span={24}>
          <p>
            <span>Descrição do treino:</span> {workoutDescription?.description}
          </p>
        </Col>
      </Row>

      <S.WorkoutTab
        activeKey={activeWeek}
        onChange={(activeKey) => handleChangeWeek(activeKey)}
        tabBarExtraContent={
          userCon.user.role === ROLES.TRAINER && (
            <Space>
              <Button type="primary" onClick={showAnnotationModal}>
                Anotação
              </Button>
              <Button onClick={addWeek}>Adicionar semana</Button>
              <Button onClick={addWorkout} disabled={weeks.length === 0}>
                Adicionar treino
              </Button>
              <Button
                onClick={cleanWorkouts}
                disabled={weeks.length === 0}
                danger
                type="primary"
              >
                Limpar treinos
              </Button>
            </Space>
          )
        }
      >
        {weeks.map((week) => (
          <TabPane tab={week.name} key={week.id}>
            <WorkoutTableForm
              setWorkoutTypes={setWorkoutTypes}
              week={week}
              workoutTypes={
                workoutTypes.find((workout) => workout.id === week.id)
                  ?.workouts || []
              }
              allWorkouts={workoutTypes}
              TABLE_DB_NAME={TABLE_DB_NAME}
              updateWeek={updateWeek}
            />
          </TabPane>
        ))}
      </S.WorkoutTab>

      <AnnotationModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setWorkoutDes={setWorkoutDescription}
        TABLE_DB_NAME={`users/${id}/annotations`}
        workoutDesc={workoutDescription}
      />
    </>
  );
}
