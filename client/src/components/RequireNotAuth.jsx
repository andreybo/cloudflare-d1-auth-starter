// client/src/components/RequireNotAuth.jsx

import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";

export const RequireNotAuth = () => {
    const { auth } = useAuth();
    
    // Redirect to the homepage if the user is already authenticated
    return auth ? <Navigate to="/" replace /> : <Outlet />;
};
