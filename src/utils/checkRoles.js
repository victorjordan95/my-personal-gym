import { ROLES } from '../constants/roles';

const isAdmin = (role) => role === ROLES.ADMIN;

const isOriented = (role) => role === ROLES.ORIENTED;

const isTrainer = (role) => role === ROLES.TRAINER;

export { isAdmin, isOriented, isTrainer };
