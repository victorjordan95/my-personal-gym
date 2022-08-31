import { Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import CrudService from '../../services/CrudService';
import { errorHandler } from '../../utils/errorHandler';

export function AnnotationModal({
  isModalVisible,
  setIsModalVisible,
  workoutDesc,
  setWorkoutDes,
  TABLE_DB_NAME,
}) {
  const [workoutDescription, setWorkoutDescription] = useState(
    workoutDesc?.description || ''
  );

  const handleSave = async () => {
    try {
      let resp;
      if (workoutDesc?.id) {
        resp = await CrudService.update(TABLE_DB_NAME, workoutDesc.id, {
          description: workoutDescription,
        });
      } else {
        resp = await CrudService.save(TABLE_DB_NAME, {
          description: workoutDescription,
        });
      }
      setWorkoutDes(resp);
    } catch (error) {
      errorHandler(error);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    setWorkoutDescription(e.target.value);
  };

  return (
    <Modal
      title="Anotação do treino"
      visible={isModalVisible}
      onOk={handleSave}
      onCancel={handleCancel}
    >
      <TextArea
        placeholder="Informações adicionais do treino para o aluno"
        rows={4}
        value={workoutDescription}
        onChange={handleChange}
      />
    </Modal>
  );
}
