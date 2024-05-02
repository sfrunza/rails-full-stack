import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from '@/store';
import Spinner from './Spinner';

export default function RequireAuth({
  allowedRoles,
}: {
  allowedRoles: string;
}) {
  const { user, isVerifying } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isVerifying) {
    return <Spinner />;
  }
  return user?.role === allowedRoles ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
