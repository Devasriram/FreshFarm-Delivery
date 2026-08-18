import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { DeliveryAuthContext } from "../context/DeliveryAuthContext";

function DeliveryProtectedRoute({ children }) {
  const { partner, loading } = useContext(DeliveryAuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!partner && !localStorage.getItem("delivery_token")) {
    return <Navigate to="/delivery/login" replace />;
  }

  return children;
}

export default DeliveryProtectedRoute;
