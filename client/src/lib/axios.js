import axios from "axios";

// API Base URL from .env configuration
const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

if (!baseURL) {
  console.error("API Base URL is not set. Check your .env file."); // Log an error if the base URL is missing
}

console.log("API Base URL:", baseURL); // Log the base URL for debugging

// Standard Axios instance for general API requests
const axiosInstance = axios.create({ baseURL });

// Private Axios instance with session management
export const axiosPrivate = axios.create({
  baseURL, // Use the same base URL
  headers: { "Content-Type": "application/json" }, // Default headers for JSON requests
  withCredentials: true, // Ensures cookies are sent with requests for authentication
});

// Response interceptor to handle errors for the private Axios instance
axiosPrivate.interceptors.response.use(
  (response) => response, // Return the response as is if there are no errors
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized error (e.g., expired or invalid session)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops

      console.error("Unauthorized access, performing logout."); // Log the unauthorized error

      // Clear localStorage to remove any stored user data
      localStorage.clear();

      // Optionally, clear session cookies
      document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.toopost.us; secure; SameSite=None";

      // Redirect the user to the login page
      window.location.href = "/login";
    }

    // Reject the promise with the error for further handling
    return Promise.reject(error);
  }
);

export default axiosInstance;
