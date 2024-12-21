import { setTitle } from '../../utils/generalFunctions';
import { useRef, useState, useEffect } from "react";
import axios from '../../lib/axios';
import { FaCheck, FaTimes, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

// Validation Regex Patterns
const userRegex = /^[A-Za-z][A-Za-z0-9-_]{3,18}$/;
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!*@#$%]).{8,24}$/;

export const Register = () => {
    setTitle("Register");

    const usernameRef = useRef();

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [success, setSuccess] = useState(false);

    const passwordValidationRules = [
        { rule: /^(?=.*[a-z])/, message: "At least one lowercase letter" },
        { rule: /^(?=.*[A-Z])/, message: "At least one uppercase letter" },
        { rule: /^(?=.*\d)/, message: "At least one number" },
        { rule: /^(?=.*[!*@#$%])/, message: "At least one special character (!*@#$%)" },
        { rule: /^.{8,24}$/, message: "8-24 characters long" },
    ];

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        setValidUsername(userRegex.test(username));
    }, [username]);

    useEffect(() => {
        setValidEmail(emailRegex.test(email));
    }, [email]);

    useEffect(() => {
        setValidPassword(passwordRegex.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValidForm = userRegex.test(username) && emailRegex.test(email) && passwordRegex.test(password) && (password === matchPassword);
        if (!isValidForm) {
            toast.error("Please ensure all fields are correctly filled.");
            return;
        }

        try {
            const uuid = crypto.randomUUID();
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}/api/register`,
                { username, email, password, uuid },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            toast.success("Registration successful! Redirecting...");
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                toast.error("No response from server.");
            } else if (err.response?.status === 409) {
                toast.error(err.response?.data?.message || "Username or email already exists.");
            } else {
                toast.error("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Toaster position="top-right" reverseOrder={false} />
            {success ? (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Success!</h2>
                    <p className="text-gray-600">
                        You can now <a href="/login" className="text-blue-500 hover:underline">log in</a>.
                    </p>
                </div>
            ) : (
                <div className="w-full max-w-md bg-white shadow-md rounded-md p-8">
                    <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Register</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Username Field */}
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 text-sm mb-1">
                                Username
                            </label>
                            <div className="flex items-center border rounded px-3">
                                <FaUser className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    id="username"
                                    ref={usernameRef}
                                    placeholder="Enter a username"
                                    autoComplete="off"
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    required
                                    className="w-full py-2 px-1 outline-none"
                                />
                            </div>
                            {!validUsername && username && (
                                <p className="text-xs text-red-600 mt-1">
                                    Username must be 4-18 characters and start with a letter.
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
                                Email
                            </label>
                            <div className="flex items-center border rounded px-3">
                                <FaEnvelope className="text-gray-400 mr-2" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                    className="w-full py-2 px-1 outline-none"
                                />
                            </div>
                            {!validEmail && email && (
                                <p className="text-xs text-red-600 mt-1">
                                    Please enter a valid email address.
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm mb-1">
                                Password
                            </label>
                            <div className="flex items-center border rounded px-3">
                                <FaLock className="text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter a password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                    className="w-full py-2 px-1 outline-none"
                                />
                            </div>
                            <ul className="mt-2 text-sm text-gray-500">
                                {passwordValidationRules.map((rule, index) => (
                                    <li key={index} className="flex items-center mb-1">
                                        {rule.rule.test(password) ? (
                                            <FaCheck className="text-green-500 mr-2" />
                                        ) : (
                                            <FaTimes className="text-red-500 mr-2" />
                                        )}
                                        <span>{rule.message}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-4">
                            <label htmlFor="password_confirm" className="block text-gray-700 text-sm mb-1">
                                Confirm Password
                            </label>
                            <div className="flex items-center border rounded px-3">
                                <FaLock className="text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    id="password_confirm"
                                    placeholder="Confirm password"
                                    onChange={(e) => setMatchPassword(e.target.value)}
                                    value={matchPassword}
                                    required
                                    className="w-full py-2 px-1 outline-none"
                                />
                            </div>
                            {!validMatch && matchPassword && (
                                <p className="text-xs text-red-600 mt-1">
                                    Passwords must match.
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!(validUsername && validEmail && validPassword && validMatch)}
                            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="text-center mt-6 text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-500 hover:underline">
                            Log in
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};
