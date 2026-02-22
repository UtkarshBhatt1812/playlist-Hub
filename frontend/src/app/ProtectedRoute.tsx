import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";

 const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAppSelector(state=>state.auth.token)

  if(!isAuthenticated){
    return <Navigate to="/login" replace />;
  }
  return children
}
export default ProtectedRoute;