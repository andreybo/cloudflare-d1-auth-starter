import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem("auth");
        return savedAuth ? JSON.parse(savedAuth) : {};
    });
    
    const [persist, setPersist] = useState(() => {
        const persistValue = localStorage.getItem("persist");
        return persistValue ? JSON.parse(persistValue) : false;
    });

    useEffect(() => {
        if (auth?.accessToken && persist) {
            localStorage.setItem("auth", JSON.stringify(auth));
        } else {
            localStorage.removeItem("auth");
        }
    }, [auth, persist]);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
