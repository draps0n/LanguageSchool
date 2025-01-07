import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RequireAuth({ allowedRoles = [] }) {
  const { userData } = useAuth();
  const location = useLocation();

  if (!userData?.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles.length === 0 ||
    (userData?.role.id && allowedRoles?.includes(userData.role.id))
  ) {
    return <Outlet />;
  }

  return <Navigate to="/forbidden" state={{ from: location }} replace />;
}

export default RequireAuth;
