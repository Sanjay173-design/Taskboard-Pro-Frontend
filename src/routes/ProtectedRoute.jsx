import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // 1️⃣ Still checking auth state
  if (isLoading) {
    return <Loader />;
  }

  // 2️⃣ Not authenticated → go to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Auth OK → render app
  return children;
}
