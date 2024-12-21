import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";
import { Error } from "../pages/Error/index";
import jwt_decode from "jwt-decode";

export const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    // Проверяем, есть ли токен
    if (!auth?.accessToken) {
        console.warn("No access token found. Redirecting to login...");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log(jwt_decode(auth.accessToken));

    let decoded;
    try {
        // Декодируем токен
        decoded = jwt_decode(auth.accessToken);

        // Проверяем истечение токена
        if (decoded.exp * 1000 < Date.now()) {
            console.warn("Access token has expired. Redirecting to login...");
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    } catch (error) {
        console.error("Failed to decode token:", error.message);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Получаем роль пользователя
    const role = decoded?.role || null;
    console.log("Decoded role:", role);

    // Проверяем, соответствует ли роль необходимым
    const hasAccess = allowedRoles.includes(role);
    if (!hasAccess) {
        console.warn("User does not have the required role:", { userRole: role, allowedRoles });
        return <Error code="403" />;
    }

    // Если доступ есть, рендерим дочерние компоненты
    return <Outlet />;
};


export const RequireNotAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.username
            ? <Navigate to="/" state={{ from: location }} replace />
            : <Outlet />
    );
};
