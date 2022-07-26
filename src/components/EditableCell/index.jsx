/* eslint-disable react/jsx-props-no-spreading */
import { Form, Input, Select } from 'antd';

const { Option } = Select;

export function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  workouts,
  onChange,
  ...restProps
}) {
  const inputNode =
    inputType === 'select' ? (
      <Select
        showSearch
        placeholder="Selecione um exercício"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {workouts.map((workout) => (
          <Option key={workout.id} value={workout.name}>
            {workout.name}
          </Option>
        ))}
      </Select>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
            width: inputType === 'select' ? '190px' : 'auto',
          }}
          rules={[
            {
              required: true,
              message: `Insira ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}
