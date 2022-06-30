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
import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { EditableCell } from '../../../components/EditableCell';
import CrudService from '../../../services/CrudService';
import { deepFreeze } from '../../../utils/deepFreeze';
import { errorHandler } from '../../../utils/errorHandler';

export function WorkoutTableForm({
  workoutTypes,
  setWorkoutTypes,
  week,
  TABLE_DB_NAME,
}) {
  const freezedDB = deepFreeze(week);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(2);

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
    const oldWorkouts = workoutTypes.filter(
      (workout) => workout.name !== workoutGroup.name
    );

    try {
      const row = await form.validateFields();
      const newData = [...(workoutGroup.workouts ?? [])];
      const index = newData.findIndex((item) => record.key === item.key);

      const item = newData[index];
      workoutGroup.workouts.splice(index, 1, { ...item, ...row });
      setWorkoutTypes([...oldWorkouts, workoutGroup]);
      saveWorkout({ item, row });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
    setEditingKey('');
  }

  function handleAddExercise(idParam) {
    const workouts = workoutTypes.find((item) => item.id === idParam);
    const uuid = uuidv4();
    const newData = {
      ...workouts,
      workouts: [
        ...workouts.workouts,
        {
          key: uuid,
          id: uuid,
          name: '',
          repetitions: '',
          series: '',
          weight: '',
          rest: '',
          workoutType: workouts.name,
        },
      ],
    };

    const newDataWorkouts = [
      ...workoutTypes.filter((item) => item.id !== idParam),
      newData,
    ];

    setWorkoutTypes(newDataWorkouts.sort((a, b) => a.id - b.id));
    setCount(count + 1);
  }

  function edit(record) {
    form.setFieldsValue({
      key: '0',
      name: '',
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
    const workouts = workoutTypes.find(
      (item) => item.name === exercise.workoutType
    );
    const newData = [...workouts.workouts];
    const index = newData.findIndex((item) => exercise.key === item.key);
    newData.splice(index, 1);
    const newDataWorkouts = [
      ...workoutTypes.filter((item) => item.name !== exercise.workoutType),
    ];
    newDataWorkouts.push({ ...workouts, workouts: newData });
    setWorkoutTypes(newDataWorkouts.sort((a, b) => a.id - b.id));

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

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return workoutTypes.map((workoutType) => (
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
  ));
}
