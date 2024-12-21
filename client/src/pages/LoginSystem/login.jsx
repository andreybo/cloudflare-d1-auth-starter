import { setTitle } from '../../utils/generalFunctions';
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from '../../lib/axios';
import useAuth from '../../hooks/auth/useAuth';
import { FaUser, FaLock } from "react-icons/fa";

export const Login = () => {
    setTitle();

    const { setAuth, persist, setPersist } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirection = location.state?.from?.pathname || '/';

    const usernameOrEmailRef = useRef();
    const errRef = useRef();

    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        usernameOrEmailRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [usernameOrEmail, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                '/api/login',
                JSON.stringify({ usernameOrEmail, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const { accessToken, username, email, role } = response.data;
            setAuth({ username, email, role, accessToken });

            setUsernameOrEmail('');
            setPassword('');
            navigate(redirection, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("The server didn't respond.");
            } else if ([400, 401].includes(err.response?.status)) {
                setErrMsg(err.response?.data?.message);
            } else {
                setErrMsg('Login failed.');
            }
            setTimeout(() => setErrMsg(''), 4000);
            errRef.current.focus();
        }
    };

    const togglePersist = () => setPersist(prev => !prev);

    useEffect(() => {
        localStorage.setItem('persist', persist);
    }, [persist]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-md rounded-md p-8">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Login</h1>
                <p
                    ref={errRef}
                    className={`text-red-600 text-sm mb-4 ${!errMsg && "hidden"}`}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="usernameOrEmail" className="block text-gray-700 text-sm mb-1">
                            Username or Email
                        </label>
                        <div className="flex items-center border rounded px-3">
                            <FaUser className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                id="usernameOrEmail"
                                ref={usernameOrEmailRef}
                                placeholder="Your username or email"
                                autoComplete="off"
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                value={usernameOrEmail}
                                required
                                className="w-full py-2 px-1 outline-none"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm mb-1">
                            Password
                        </label>
                        <div className="flex items-center border rounded px-3">
                            <FaLock className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                id="password"
                                placeholder="Your password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                                className="w-full py-2 px-1 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={JSON.parse(persist)}
                                onChange={togglePersist}
                                className="mr-2"
                            />
                            Remember me
                        </label>
                        <a href="/forgot-password" className="hidden text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={!usernameOrEmail || !password}
                        className="cursor-pointer w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        Sign in
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
};
