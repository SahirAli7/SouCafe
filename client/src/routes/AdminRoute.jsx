import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // adjust path if needed

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />; // redirect to homepage
  }

  return children;
};

export default AdminRoute;
