import { ROLES } from '../constants/roles';
import { isMe } from './isMe';

/**
 * It checks if the user is on his own page, if not, it redirects him to a 404 page
 * @param {String} id - The id on URL
 * @param {String} bdId - The id of the user on the database
 * @param {String} role - The role of the user
 * @param {Function} navigate - The function to redirect the user
 * @returns {Boolean} - True if the user is on his own page, false otherwise
 */
export function checkRedirectUser({ id, bdId, role, navigate }) {
  if (role !== ROLES.ORIENTED) {
    return true;
  }

  const isMyPage = isMe(id, bdId);
  if (!isMyPage) {
    navigate('/nao-encontrado');
    return false;
  }

  return true;
}
