/* eslint-disable no-unused-vars */
import { Button, Space, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { workoustIds } from '../../constants/workoutsNamesById';
import CrudService from '../../services/CrudService';
import { WorkoutTableForm } from './OrientedWorkoutForm';
import { errorHandler } from '../../utils/errorHandler';

const { TabPane } = Tabs;

export function OrientedWorkout() {
  const { id } = useParams();
  const TABLE_DB_NAME = `orienteds/${id}/treinos`;
  const [weeks, setWeeks] = useState([{ id: 1, name: 'Semana 1' }]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [activeWeek, setActiveWeek] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const addWeek = () => {
    const newData = {
      id: uuidv4(),
      name: `Semana ${weeks.length + 1}`,
      workouts: [],
    };
    setWeeks([...weeks, newData]);
    setWorkoutTypes([...weeks, newData]);
    try {
      CrudService.save(TABLE_DB_NAME, newData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const addWorkout = async () => {
    const currentlyActiveWeek = workoutTypes.find(
      (week) => week.id === activeWeek
    );
    const currentlyActiveWeekIndex = workoutTypes.findIndex(
      (week) => week.id === activeWeek
    );
    const workoutsWeek = currentlyActiveWeek?.workouts;
    const newData = {
      id: workoustIds[workoutsWeek.length + 1],
      name: workoustIds[workoutsWeek.length + 1],
      workouts: [],
    };

    const uuid = uuidv4();
    const newDataDB = {
      ...currentlyActiveWeek,
      workouts: [
        ...currentlyActiveWeek.workouts,
        {
          workoutType: workoustIds[workoutsWeek.length + 1],
          id: uuid,
          key: uuid,
          name: '',
          repetitions: '',
          series: '',
          weight: '',
          rest: '',
        },
      ],
    };

    try {
      await CrudService.update(TABLE_DB_NAME, activeWeek, newDataDB);
    } catch (error) {
      errorHandler(error);
    }

    setWorkoutTypes([
      ...workoutTypes.slice(0, currentlyActiveWeekIndex),
      {
        ...workoutTypes[currentlyActiveWeekIndex],
        workouts: [...workoutTypes[currentlyActiveWeekIndex].workouts, newData],
      },
      ...workoutTypes.slice(currentlyActiveWeekIndex + 1),
    ]);
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
        workouts: exerciceType,
      };
    });

    console.log([
      ...workoutTypes,
      {
        id: week.id,
        workouts: [...exercisesList],
      },
    ]);
    setWorkoutTypes((prevExer) => [
      ...prevExer,
      {
        id: week.id,
        workouts: [...exercisesList],
      },
    ]);
    setIsLoading(false);
  }

  async function getWeeks() {
    try {
      const weeksData = await CrudService.getAll(TABLE_DB_NAME);
      setWeeks(weeksData);
      setActiveWeek(weeksData[0].id);
      weeksData.forEach((week) => {
        getExercises(week);
      });
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

  useEffect(() => {
    getWeeks();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Tabs
      onChange={(activeKey) => handleChangeWeek(activeKey)}
      tabBarExtraContent={
        <Space>
          <Button onClick={addWeek}>Adicionar semana</Button>
          <Button onClick={() => addWorkout()}>Adicionar treino</Button>
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
          />
        </TabPane>
      ))}
    </Tabs>
  );
}
