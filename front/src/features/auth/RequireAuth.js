import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectUserRoles } from "./authSlice";

const RequireAuth = ({ allowedRoles }) => {
  const token = useSelector(selectCurrentToken);
  const roles = useSelector(selectUserRoles);
  const location = useLocation();

  return token && roles && roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : token ? (
    <Navigate to="/notAllowed" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default RequireAuth;
