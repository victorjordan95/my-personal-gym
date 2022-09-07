import {
  Button,
  Col,
  Collapse,
  Divider,
  Form,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { EditableCell } from '../../../components/EditableCell';
import userContext from '../../../contexts/userContext';
import CrudService from '../../../services/CrudService';
import { isOriented, isTrainer } from '../../../utils/checkRoles';
import { deepFreeze } from '../../../utils/deepFreeze';
import { errorHandler } from '../../../utils/errorHandler';

export function WorkoutTableForm({
  activeKey,
  allWorkouts,
  workoutTypes,
  setWorkoutTypes,
  week,
  TABLE_DB_NAME,
  updateWeek,
}) {
  const freezedDB = deepFreeze(week);
  const freezeAllWorkouts = deepFreeze(allWorkouts);

  const { user } = useContext(userContext);
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState('');
  const [workoutsRegistered, setWorkoutsRegistered] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState({});

  const isEditing = (record) => record.key === editingKey;
  const cancel = () => setEditingKey('');

  async function updateBD(id, data) {
    try {
      await CrudService.update(TABLE_DB_NAME, id, data);
      updateWeek(id, data);
    } catch (error) {
      errorHandler(error);
    }
  }

  function updateExercise({ data, exercise }) {
    const index = freezedDB.workouts.findIndex((el) => el.key === exercise.key);
    freezedDB.workouts[index] = data;
    updateBD(week.id, freezedDB);
  }

  function createNewExercise({ data }) {
    if (isOriented(user.role)) return;

    freezedDB.workouts.push(data);
    updateBD(week.id, freezedDB);
  }

  function saveWorkout({ item, row }) {
    const workoutType = freezedDB.workouts.find(
      (workout) =>
        workout.id === item.workoutType ||
        workout.workoutType === item.workoutType
    );

    if (!workoutType) {
      createNewExercise({ data: { ...item, ...row } });
      return;
    }

    const foundExercise = freezedDB.workouts.find((el) => el.key === item.key);
    if (foundExercise) {
      updateExercise({ data: { ...item, ...row }, exercise: foundExercise });
      return;
    }

    createNewExercise({ data: { ...item, ...row }, workoutType });
  }

  async function handleConfirmClick(record) {
    const workoutGroup = deepFreeze(
      workoutTypes.find(
        (workoutType) => workoutType.name === record.workoutType
      )
    );

    try {
      const row = await form.validateFields();
      const newData = [...(workoutGroup.workouts ?? [])];
      const index = newData.findIndex((item) => record.key === item.key);
      const weekIndex = freezeAllWorkouts.findIndex(
        (el) => el.id === record.weekId || el.id === record.id
      );
      const workoutGroupindex = freezeAllWorkouts[weekIndex].workouts.findIndex(
        (el) => el.id === workoutGroup.id
      );
      const freezeIndex =
        freezeAllWorkouts[weekIndex].workouts[workoutGroupindex];

      const item = newData[index];
      const newRow = { ...newData[index], ...row, ...selectedWorkout };

      freezeIndex.workouts[index] = {
        ...newRow,
        workoutType: freezeIndex.id,
        key: freezeIndex.workouts[index]?.key || uuidv4(),
        id: freezeIndex.workouts[index]?.id || week.id,
      };

      freezeAllWorkouts[activeKey].workouts[workoutGroupindex].workouts[index] =
        { ...item, ...row };
      setWorkoutTypes(freezeAllWorkouts);

      saveWorkout({
        item,
        row: newRow,
        weekIndex,
      });
    } catch (errInfo) {
      errorHandler(errInfo);
    }
    setEditingKey('');
  }

  function handleAddExercise(idParam) {
    const workoutIndex = workoutTypes.findIndex((item) => item.id === idParam);
    const weekIndex = freezeAllWorkouts.findIndex(
      (el) => el.id === week.id || el.id === week.id
    );

    freezeAllWorkouts[weekIndex].workouts[workoutIndex].workouts.push({
      id: '',
      key: uuidv4(),
      name: '',
      observations: '',
      repetitions: '',
      rest: '',
      series: '',
      weekId: week.id,
      weight: '',
      workoutType: idParam,
    });
    setWorkoutTypes(freezeAllWorkouts);
  }

  function edit(record) {
    form.setFieldsValue({
      key: '0',
      name: '',
      observations: '',
      repetitions: '',
      series: '',
      weight: '',
      rest: '',
      workoutType: record?.workoutType,
      ...record,
    });
    setEditingKey(record.key);
  }

  function handleRemoveExercise(exercise) {
    const weekIndex = freezeAllWorkouts.findIndex((el) => el.id === week.id);
    const workoutsList = freezeAllWorkouts[weekIndex].workouts;
    const indexWorkoutType = workoutsList.findIndex(
      (el) => el.id === exercise.workoutType || el.name === exercise.workoutType
    );

    const foundGroupExercises = workoutsList[indexWorkoutType].workouts;
    const foundExercise = foundGroupExercises.find(
      (el) => el.key === exercise.key
    );
    const foundExerciseIndex = foundGroupExercises.findIndex(
      (el) => el.key === exercise.key
    );

    freezedDB.workouts.splice(freezedDB.workouts.indexOf(foundExercise), 1);

    freezeAllWorkouts[weekIndex].workouts[indexWorkoutType].workouts.splice(
      foundExerciseIndex,
      1
    );

    setWorkoutTypes(freezeAllWorkouts);
    updateBD(week.id, freezedDB);
  }

  function removeWholeWorkout(key) {
    const newData = workoutTypes.filter((item) => item.id !== key);
    const newDataDB = {
      ...week,
      workouts: week.workouts.filter((item) => item.workoutType !== key),
    };
    updateBD(week.id, newDataDB);
    setWorkoutTypes(newData);
  }

  const columns = [
    {
      title: 'Exercício',
      dataIndex: 'name',
      editable: isTrainer(user.role),
      fixed: 'left',
      render: (_, record) =>
        record?.url_video ? (
          <a href={record?.url_video} target="_blank" rel="noreferrer">
            {record.name}
          </a>
        ) : (
          record.name
        ),
    },
    {
      title: 'Observações',
      dataIndex: 'observations',
      editable: isTrainer(user.role),
      required: false,
    },
    {
      title: 'Séries',
      dataIndex: 'series',
      editable: isTrainer(user.role),
    },
    {
      title: 'Repetições',
      dataIndex: 'repetitions',
      editable: isTrainer(user.role),
    },
    {
      title: 'Carga',
      dataIndex: 'weight',
      editable: true,
      required: false,
    },
    {
      title: 'Descanso',
      dataIndex: 'rest',
      editable: isTrainer(user.role),
      isLastInput: true,
    },
    {
      title: 'Ação',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => handleConfirmClick(record)}
              style={{ marginRight: 8 }}
            >
              Salvar
            </Typography.Link>
            <Popconfirm title="Deseja mesmo cancelar?" onConfirm={cancel}>
              <span>Cancelar</span>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            {isTrainer(user.role) && (
              <Typography.Link
                disabled={editingKey !== ''}
                onClick={() => handleRemoveExercise(record)}
              >
                Remover
              </Typography.Link>
            )}

            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Editar
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  const handleChange = (value) => {
    const selectedValue = workoutsRegistered.find(
      (item) => item.name === value
    );
    setSelectedWorkout(selectedValue);
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'name' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        workouts: workoutsRegistered,
        onChange: handleChange,
        editing: isEditing(record),
      }),
    };
  });

  const rowSelection = {
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  async function getWorkouts() {
    const response = await CrudService.getAll('/workouts');
    setWorkoutsRegistered(response);
  }

  useEffect(() => {
    getWorkouts();
  }, []);

  return (
    workoutTypes.length > 0 &&
    workoutTypes.map((workoutType) => (
      <>
        <Row gutter={16}>
          <Col className="gutter-row" xs={24} md={12}>
            <Typography.Title level={3}>
              Treino: {workoutType.name}
            </Typography.Title>
          </Col>
          {isTrainer(user.role) && (
            <Col
              className="gutter-row actions-btn"
              xs={{ span: 24, offset: 0 }}
              md={{ span: 12, offset: 0 }}
            >
              <Space size={18}>
                <Button
                  onClick={() => handleAddExercise(workoutType.id)}
                  type="primary"
                >
                  Adicionar exercicio
                </Button>

                <Button
                  onClick={() => removeWholeWorkout(workoutType.id)}
                  danger
                >
                  Remover treino
                </Button>
              </Space>
            </Col>
          )}
        </Row>

        <Collapse collapsible="header" defaultActiveKey={['1']}>
          <Collapse.Panel
            header={`Treino: ${workoutType.name} - marque no ✅ os exercícios já feitos!`}
            key="1"
          >
            <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                rowSelection={rowSelection}
                bordered
                columns={mergedColumns}
                dataSource={workoutType?.workouts}
                pagination={{ hideOnSinglePage: true }}
                rowClassName="editable-row"
              />
            </Form>
          </Collapse.Panel>
        </Collapse>

        <Divider />
      </>
    ))
  );
}
