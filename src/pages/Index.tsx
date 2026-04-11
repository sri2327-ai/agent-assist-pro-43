import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
