import { Navigate, Outlet } from 'react-router-dom';
import { ROLES } from '../../constants/roles';

export function TrainersRoute({ user, children }) {
  if (user.role !== ROLES.ADMIN && user.role !== ROLES.TRAINER) {
    return <Navigate to="inicio" replace />;
  }

  return children || <Outlet />;
}
