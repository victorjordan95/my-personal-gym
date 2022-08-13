/**
 * It returns true if the user is me, false otherwise.
 * @param user - The user object that you want to check if it's you.
 * @param me - The user object of the current user
 */
export function isMe(user, me) {
  return user === me;
}
