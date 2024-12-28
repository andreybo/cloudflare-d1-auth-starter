import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.error("useAuth must be used within an AuthProvider");
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default useAuth;
