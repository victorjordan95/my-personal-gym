import { notification } from 'antd';

/**
 * It takes an error object as an argument, and displays a notification with the error message
 * @param error - The error object that was thrown.
 */
export function errorHandler(error) {
  console.error(error);
  notification.error({
    message: 'Ocorreu um erro',
    description: error.message,
    duration: 4.5,
  });
}
