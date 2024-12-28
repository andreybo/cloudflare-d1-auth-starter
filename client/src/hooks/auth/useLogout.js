import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth'; // Ensure the path to the custom hook is correct
import { axiosPrivate } from "../../lib/axios"; // Correct path to the Axios instance

const useLogout = () => {
    const { setAuth } = useAuth(); // Access the authentication context
    const navigate = useNavigate();

    const logout = async () => {
        try {
            // Send a POST request to the /api/auth/logout endpoint using the axiosPrivate instance
            const response = await axiosPrivate.post('/api/auth/logout');

            // Check if the server response status is not 200, throw an error
            if (response.status !== 200) {
                throw new Error('Logout failed');
            }

            // Clear the session cookie (optional, as the server handles this)
            // Uncomment if needed for client-side cleanup:
            // Cookies.remove('session_id', { path: '/' });

            // Reset the authentication state in the context to null
            setAuth(null);

            // Redirect the user to the login page
            navigate('/login');
        } catch (err) {
            // Log any errors that occur during the logout process
            console.error('Logout failed:', err);
            // Optional: Display an error message to the user if needed
        }
    };

    // Return the logout function for use in components
    return logout;
};

export default useLogout;
