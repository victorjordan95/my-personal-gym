import { notification } from 'antd';

export function errorHandler(error) {
  notification.error({
    message: 'Ocorreu um erro',
    description: error.message,
    duration: 4.5,
  });
}
