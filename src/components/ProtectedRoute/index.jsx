import { Navigate, Outlet } from 'react-router-dom';
import { ContainerApp } from '../ContainerApp';

export function ProtectedRoute({ user, children, redirectPath = '/landing' }) {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <ContainerApp>{children || <Outlet />}</ContainerApp>;
}
