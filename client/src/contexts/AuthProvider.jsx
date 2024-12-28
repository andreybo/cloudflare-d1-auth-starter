import { useContext, useState, useEffect, createContext } from "react";
import { axiosPrivate } from "../lib/axios";
import Loader from "../components/Loader";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true); // Добавим состояние загрузки

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axiosPrivate.get('/api/auth/session');
                console.log('Response headers:', response.headers);
                console.log('Response body:', response.data);

                if (response.data?.user) {
                    setAuth(response.data);
                    console.log('User authenticated:', response.data.user);
                } else {
                    setAuth(null);
                    console.log('No user data found.');
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
                setAuth(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    if (loading) {
        return <Loader />; // Показать загрузчик пока идёт проверка сессии
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
