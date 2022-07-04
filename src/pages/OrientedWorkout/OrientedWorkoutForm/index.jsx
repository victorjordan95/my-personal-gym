/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Col,
  Divider,
  Form,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { EditableCell } from '../../../components/EditableCell';
import CrudService from '../../../services/CrudService';
import { deepFreeze } from '../../../utils/deepFreeze';
import { errorHandler } from '../../../utils/errorHandler';

export function WorkoutTableForm({
  allWorkouts,
  workoutTypes,
  setWorkoutTypes,
  week,
  TABLE_DB_NAME,
}) {
  const freezedDB = deepFreeze(week);
  const freezeAllWorkouts = deepFreeze(allWorkouts);

  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState('');
  const [workoutsRegistered, setWorkoutsRegistered] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState({});

  const isEditing = (record) => record.key === editingKey;
  const cancel = () => setEditingKey('');

  async function updateBD(id, data) {
    try {
      await CrudService.update(TABLE_DB_NAME, id, data);
    } catch (error) {
      errorHandler(error);
    }
  }

  function saveWorkout({ item, row }) {
    const weekItemIndex = week.workouts.findIndex((w) => w.id === item.id);

    if (weekItemIndex === -1) {
      freezedDB.workouts.push({ ...item, ...row });
    } else {
      freezedDB.workouts.splice(weekItemIndex, 1, { ...item, ...row });
    }
    updateBD(week.id, freezedDB);
  }

  async function handleConfirmClick(record) {
    const workoutGroup = deepFreeze(
      workoutTypes.find(
        (workoutType) => workoutType.name === record.workoutType
      )
    );

    try {
      const row = await form.validateFields();
      const newRow = { ...row, ...selectedWorkout };
      const newData = [...(workoutGroup.workouts ?? [])];
      const index = newData.findIndex((item) => record.key === item.key);
      const workoutGroupindex = freezeAllWorkouts[0].workouts.findIndex(
        (el) => el.id === workoutGroup.id
      );

      freezeAllWorkouts[0].workouts[workoutGroupindex].workouts[index] = {
        ...newRow,
        workoutType: freezeAllWorkouts[0].workouts[workoutGroupindex].id,
        key:
          freezeAllWorkouts[0].workouts[workoutGroupindex].workouts[index]
            ?.key || uuidv4(),
        id:
          freezeAllWorkouts[0].workouts[workoutGroupindex].workouts[index]
            ?.id || week.id,
      };
      const item = newData[index];

      setWorkoutTypes(freezeAllWorkouts);
      saveWorkout({ item, row: newRow });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
    setEditingKey('');
  }

  function handleAddExercise(idParam) {
    const workoutIndex = workoutTypes.findIndex((item) => item.id === idParam);

    const uuid = uuidv4();
    freezeAllWorkouts[0].workouts[workoutIndex].workouts.push({
      key: uuid,
      id: week.id,
      observations: '',
      name: '',
      repetitions: '',
      series: '',
      weight: '',
      rest: '',
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
    const indexWorkoutType = freezeAllWorkouts[0].workouts.findIndex(
      (el) => el.id === exercise.workoutType
    );

    const removeIndex = freezeAllWorkouts[0].workouts[
      indexWorkoutType
    ].workouts.findIndex((el) => el.key === exercise.key);

    const workoutIndex = freezeAllWorkouts[0].workouts.findIndex(
      (el) => el.name === exercise.workoutType
    );

    if (indexWorkoutType === -1) {
      const arrayRemoveWorkouts =
        freezeAllWorkouts[0].workouts[workoutIndex].workouts;
      delete arrayRemoveWorkouts[arrayRemoveWorkouts.length - 1];
      setWorkoutTypes(freezeAllWorkouts);
      return;
    }

    delete freezeAllWorkouts[0].workouts[indexWorkoutType].workouts[
      removeIndex
    ];
    setWorkoutTypes(freezeAllWorkouts);

    const weekItemIndex = week.workouts.findIndex((w) => w.id === exercise.id);
    freezedDB.workouts.splice(weekItemIndex, 1);
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
      editable: true,
      render: (_, record) => (
        <a href={record?.url_video} target="_blank" rel="noreferrer">
          {record.name}
        </a>
      ),
    },
    {
      title: 'Observações',
      dataIndex: 'observations',
      editable: true,
    },
    {
      title: 'Séries',
      dataIndex: 'series',
      editable: true,
    },
    {
      title: 'Repetições',
      dataIndex: 'repetitions',
      editable: true,
    },
    {
      title: 'Carga',
      dataIndex: 'weight',
      editable: true,
    },
    {
      title: 'Descanso',
      dataIndex: 'rest',
      editable: true,
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
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Deseja mesmo cancelar?" onConfirm={cancel}>
              <span>Cancel</span>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => handleRemoveExercise(record)}
            >
              Remover
            </Typography.Link>

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
    setSelectedWorkout({
      name: selectedValue.name,
      id: selectedValue.id,
      type: selectedValue.type,
      url_video: selectedValue?.url_video ?? '',
    });
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
          <Col className="gutter-row" span={6}>
            <Typography.Title level={3}>
              Treino: {workoutType.name}
            </Typography.Title>
          </Col>
          <Col
            className="gutter-row"
            span={8}
            offset={10}
            style={{ textAlign: 'right' }}
          >
            <Space size={18}>
              <Button
                onClick={() => handleAddExercise(workoutType.id)}
                type="primary"
              >
                Adicionar exercicio
              </Button>

              <Button onClick={() => removeWholeWorkout(workoutType.id)} danger>
                Remover treino
              </Button>
            </Space>
          </Col>
        </Row>

        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            columns={mergedColumns}
            dataSource={workoutType?.workouts}
            pagination={{ hideOnSinglePage: true }}
            rowClassName="editable-row"
          />
        </Form>
        <Divider />
      </>
    ))
  );
}
