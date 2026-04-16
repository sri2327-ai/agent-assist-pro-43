import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
