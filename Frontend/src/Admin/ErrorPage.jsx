import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ErrorPage = () => {
  const token = Cookies.get("token");

  // Agar user login hai, home "/" pe bhej do
  if (token) return <Navigate to="/" replace />;

  // Agar login nahi hai, login page pe bhej do
  return <Navigate to="/admin/login" replace />;
};

export default ErrorPage;
