// client/src/components/PersistLogin.jsx

import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/auth/useAuth"; // Ensure correct import path

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useAuth(); // Destructure only what's needed

    useEffect(() => {
        // If the user is authenticated, stop loading
        if (auth) {
            setIsLoading(false);
        } else {
            // Implement any additional logic if needed, such as auto-login attempts
            setIsLoading(false);
        }
    }, [auth]);

    return (
        <>
            {/* Render Outlet only after loading is complete */}
            {isLoading ? (
                <h2 className="container">Loading...</h2>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default PersistLogin;
