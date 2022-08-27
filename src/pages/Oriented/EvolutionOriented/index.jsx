/* eslint-disable react/jsx-props-no-spreading */
import { Line } from '@ant-design/charts';
import { Button, Drawer, Empty, Form, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import CrudService from '../../../services/CrudService';
import { errorHandler } from '../../../utils/errorHandler';
import { successHandler } from '../../../utils/successHandler';
import * as S from './styles';

export function EvolutionOriented() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [configChart, setConfigChart] = useState({});

  const handleCloseModal = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleOpenModal = () => {
    setVisible(true);
  };

  const saveWeight = async (values) => {
    try {
      const parsedValues = {
        ...values,
        weight: Number(values.weight.replace(',', '.')),
      };
      setChartLoading(true);
      await CrudService.save(`users/${id}/weight`, parsedValues);
      handleCloseModal();
      successHandler('Peso adicionado com sucesso.');
      setData((prev) => [{ ...values }, ...prev]);
    } catch (error) {
      errorHandler(error);
    }
    setChartLoading(false);
  };

  const onFinish = async (values) => {
    saveWeight(values);
  };

  const asyncFetch = async () => {
    try {
      setChartLoading(true);
      const res = await CrudService.getAll(`users/${id}/weight`);
      const sortedData = res.sort(
        (a, b) => a.createdAt.toDate() - b.createdAt.toDate()
      );
      const parsedData = sortedData.map((el) => {
        const date = new Date(el.createdAt.toDate());
        return {
          weight: Number(el.weight),
          Date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            '0'
          )}-${String(date.getDate()).padStart(2, '0')}`,
        };
      });

      setData(parsedData.sort((a, b) => new Date(a.Date) > new Date(b.Date)));
      const weightMedia =
        parsedData.reduce((acc, curr) => acc + curr.weight, 0) /
        parsedData.length;

      const config = {
        data,
        padding: 'auto',
        xField: 'Date',
        yField: 'weight',
        xAxis: {
          type: 'timeCat',
          // tickCount: 5,
        },
        yAxis: {
          min: weightMedia - 5,
          max: weightMedia + 5,
        },
      };
      setConfigChart(config);
    } catch (error) {
      errorHandler(error);
    }
    setChartLoading(false);
  };

  useEffect(() => {
    asyncFetch();
  }, []);

  return (
    <S.Container>
      <header className="evolution__header">
        <Button type="primary" onClick={handleOpenModal}>
          Adicionar pesagem
        </Button>
      </header>

      {chartLoading && <span>Carregando dados</span>}

      {data.length <= 2 && !chartLoading && (
        <Empty description="Adicione mais marcações para visualizar o gráfico" />
      )}

      {data.length > 2 && !chartLoading && configChart && (
        <Line {...configChart} />
      )}

      <Drawer
        closable
        key="right"
        onClose={handleCloseModal}
        placement="right"
        title="Adicionar novo peso"
        visible={visible}
      >
        <Form
          form={form}
          hideRequiredMark
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item label="Peso" name="weight">
            <Input type="number" placeholder="Ex.: 72.2" />
          </Form.Item>

          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button htmlType="submit" type="primary">
              Salvar
            </Button>
          </Space>
        </Form>
      </Drawer>
    </S.Container>
  );
}
