import { Navigate, Outlet } from "react-router-dom";
import { getAuthState } from "../utils/auth";

const AdminRoute = () => {
  const { isAdmin } = getAuthState();

  if (!isAdmin) {
    return <Navigate to="/members" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
