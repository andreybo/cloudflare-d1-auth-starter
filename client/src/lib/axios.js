import axios from 'axios';
const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
console.log("API Base URL:", baseURL);

export default axios.create({ baseURL });

export const axiosPrivate = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
