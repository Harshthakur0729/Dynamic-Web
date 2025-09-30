import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const IsAuth = ({ children }) => {
    const token = Cookies.get("token");
    const location = useLocation();

    // Agar token nahi hai, redirect to /admin/register
    if (!token) {
        return <Navigate to="/admin/register" replace />;
    }

    const restrictedPaths = ["/admin/login", "/admin/register"];
    if (token && restrictedPaths.includes(location.pathname)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default IsAuth;
