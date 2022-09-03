import { Navigate, Outlet } from 'react-router-dom';

import { isOriented } from '../../utils/checkRoles';

export function TrainersRoute({ user, children }) {
  if (isOriented(user.role)) {
    return <Navigate to="inicio" replace />;
  }

  return children || <Outlet />;
}
