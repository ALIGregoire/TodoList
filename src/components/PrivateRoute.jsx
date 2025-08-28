import { verifyToken } from "../services/AuthService";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const isAuth = verifyToken();

  return isAuth ? children : <Navigate to="/login" replace />;
};
