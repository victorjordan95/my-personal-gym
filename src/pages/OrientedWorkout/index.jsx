/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-vars */
import { Breadcrumb, Button, Space, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link, useLocation, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { workoustIds } from '../../constants/workoutsNamesById';
import CrudService from '../../services/CrudService';
import { WorkoutTableForm } from './OrientedWorkoutForm';
import { errorHandler } from '../../utils/errorHandler';

import * as S from './styles';

const { TabPane } = Tabs;

export function OrientedWorkout() {
  const { id } = useParams();
  const { state } = useLocation();
  const TABLE_DB_NAME = `orienteds/${id}/treinos`;

  const [weeks, setWeeks] = useState([{ id: 1, name: 'Semana 1' }]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [activeWeek, setActiveWeek] = useState(1);
  const [user, setUser] = useState({ name: '', id: '' });

  const [isLoading, setIsLoading] = useState(true);

  const addWorkout = async () => {
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

  const addWeek = () => {
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
      const newWeeks = [...weeks, newData];
      CrudService.save(TABLE_DB_NAME, newData);
      newWeeks.forEach((week) => {
        getExercises(week);
      });
      setWeeks(newWeeks);
      setActiveWeek(newData.id);
    } catch (error) {
      errorHandler(error);
    }
  };

  async function getWeeks() {
    try {
      const weeksData = await CrudService.getAll(TABLE_DB_NAME);
      console.log(weeksData);
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

  useEffect(() => {
    getUsername();
    getWeeks();
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

      <S.WorkoutTab
        className="testeee"
        activeKey={activeWeek}
        onChange={(activeKey) => handleChangeWeek(activeKey)}
        tabBarExtraContent={
          <Space>
            <Button onClick={addWeek}>Adicionar semana</Button>
            <Button onClick={addWorkout}>Adicionar treino</Button>
          </Space>
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
    </>
  );
}
