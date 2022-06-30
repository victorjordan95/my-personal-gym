import { notification } from 'antd';

export function successHandler(message) {
  notification.success({
    message: 'Sucesso',
    description: message,
    duration: 4.5,
  });
}
