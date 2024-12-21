import { axiosPrivate } from "../../lib/axios";
import { useEffect, useCallback } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const logout = useLogout();
    const { auth } = useAuth();

    const attachAccessToken = useCallback(
        (config) => {
            if (!config.headers["Authorization"]) {
                config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
            }
            return config;
        },
        [auth]
    );

    useEffect(() => {
        // Request interceptor to attach token
        const requestIntercept = axiosPrivate.interceptors.request.use(
            attachAccessToken,
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle 401 errors
        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true; // Prevent multiple retries
                    try {
                        const newAccessToken = await refresh();
                        prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        console.error("Token refresh failed. Logging out...");
                        logout(); // Graceful logout on repeated failure
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [attachAccessToken, refresh, logout]);

    return axiosPrivate;
};

export default useAxiosPrivate;
