import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "store";
import Spinner from "components/Spinner";

export default function PublicRoute() {
  let location = useLocation();
  const { user, isVerifying } = useSelector((state) => state.auth);

  if (isVerifying) {
    return <Spinner />;
  } else if (user) {
    return user.role === "admin" ? (
      <Navigate to="/crm/requests" state={{ from: location }} replace />
    ) : user.role === "customer" ? (
      <Navigate to="/account" state={{ from: location }} replace />
    ) : (
      <Outlet />
    );
  } else {
    return <Outlet />;
  }
}
