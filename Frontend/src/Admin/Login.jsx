import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';



const Login = () => {
    const [details, setDetails] = useState({ username: "", email: "", password: "" })
    const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL


    const handleInput = async (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    }


    const HandleForm = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${API}/api/admin/login`,
                details,
                { withCredentials: true, }
            );
            console.log("Login Success : ", res.data);
            Swal.fire("Success", res.data.message || "Logged in Successfully", "success")
                .then(() => navigate("/"));
            setDetails({ username: "", password: "" });
        } catch (error) {
            console.error("Login failed:", error);
            const errorMessage =
                error.response?.data?.message || "Invalid credentials or server issue.";
            Swal.fire("Error", errorMessage, "error");
        }
    };



    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-300 rounded-full opacity-30"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-300 rounded-full opacity-30"></div>

            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md relative z-10">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h1>
                <form onSubmit={HandleForm} className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="username" className="mb-1 font-medium text-gray-700">Username</label>
                        <input
                            className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            placeholder="Enter username"
                            name="username"
                            id="username"
                            value={details.username}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 font-medium text-gray-700">Username</label>
                        <input
                            className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            id="email"
                            value={details.email}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 font-medium text-gray-700">Password</label>
                        <input
                            className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            id="password"
                            value={details.password}
                            onChange={handleInput}
                        />
                    </div>

                    <Link
                        to="/forgot-password"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Forgot Password?
                    </Link>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>
                </form>


                <p className="text-center text-gray-500 text-sm mt-4">
                    Don't have an account?{" "}
                    <Link to="/admin/register" className="text-blue-600 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
