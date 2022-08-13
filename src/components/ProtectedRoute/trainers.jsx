import { Navigate, Outlet } from 'react-router-dom';
import { ROLES } from '../../constants/roles';
import { ContainerApp } from '../ContainerApp';

export function TrainersRoute({ user, children, redirectPath = '/' }) {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (user.role !== ROLES.ADMIN && user.role !== ROLES.TRAINER) {
    return <Navigate to="inicio" replace />;
  }

  return <ContainerApp>{children || <Outlet />}</ContainerApp>;
}
