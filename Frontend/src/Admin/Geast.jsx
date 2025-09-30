import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const Guest = ({ children }) => {
    const token = Cookies.get("token");
    const location = useLocation();
    const restrictedPaths = ["/admin/login", "/admin/register"];
    if (token && restrictedPaths.includes(location.pathname)) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default Guest;
