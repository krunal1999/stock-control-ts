import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAllowed,
  redirectTo = "/login",
}) => {
  return isAllowed ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
