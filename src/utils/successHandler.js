import { notification } from 'antd';

export function successHandler(message, placement = 'topRight') {
  notification.success({
    message: 'Sucesso',
    description: message,
    duration: 4.5,
    placement,
  });
}
