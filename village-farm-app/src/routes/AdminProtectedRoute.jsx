import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("admin_token") || localStorage.getItem("token");

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
