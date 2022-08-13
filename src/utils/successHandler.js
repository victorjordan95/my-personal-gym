import { notification } from 'antd';

/**
 * It takes a message and a placement, and returns a function that takes a notification object, and
 * returns a notification object with the message and placement set.
 * @param message - The message you want to display
 * @param [placement=topRight] - The position of the notification.
 */
export function successHandler(message, placement = 'topRight') {
  notification.success({
    message: 'Sucesso',
    description: message,
    duration: 4.5,
    placement,
  });
}
