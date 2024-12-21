import axios from "../../lib/axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const logout = useLogout();

    const refreshToken = async () => {
        if (auth?.accessToken) return auth.accessToken; // Если токен уже есть, возвращаем его
    
        try {
            const response = await axios.get("/api/refresh-token", {
                withCredentials: true,
            });
    
            const newAccessToken = response.data.accessToken;
            setAuth((prev) => ({
                ...prev,
                accessToken: newAccessToken,
            }));
    
            return newAccessToken;
        } catch (error) {
            console.error("Refresh token failed:", error);
            logout();
            throw error;
        }
    };

    return refreshToken;
};

export default useRefreshToken;
