import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";


const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
