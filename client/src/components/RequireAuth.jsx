import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";
// RequireAuth.jsx

import { Error } from "../pages/Error/index";

export const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    // Check if the session exists (i.e., if the user is logged in)
    if (!auth?.user) {
        console.warn("No user session found. Redirecting to login...");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Get user role from session data
    const role = auth.user.role || null;
    console.log("User role:", role);

    // Check if the user's role matches the allowed roles
    const hasAccess = allowedRoles.includes(role);
    if (!hasAccess) {
        console.warn("User does not have the required role:", { userRole: role, allowedRoles });
        return <Error code="403" />;
    }

    // If access is granted, render child components
    return <Outlet />;
};
