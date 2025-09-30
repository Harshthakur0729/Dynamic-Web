import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PasswordForgot = () => {
    const [data, setData] = useState({ username: "", email: "" });
    const [loading, setLoading] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // Handle input changes
    const handleInput = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submit
    const handleForm = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!data.username.trim() || !data.email.trim()) {
            return Swal.fire("Warning", "Username and Email are required.", "warning");
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API}/api/admin/forgot-password`, data, {
                withCredentials: true,
            });

            Swal.fire("Success", res.data.message || "OTP sent to your email successfully", "success")
                .then(() => navigate("/new-password"));
            setData({ username: "", email: "" });
        } catch (error) {
            console.error("Failed:", error);
            const errorMessage =
                error.response?.data?.message || "Invalid credentials or server issue.";
            Swal.fire("Error", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleForm}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
            >
                <h2 className="text-xl font-bold text-center mb-4">Forgot Password</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={data.username}
                    onChange={handleInput}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-purple-500"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={handleInput}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-purple-500"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                        } transition`}
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>
            </form>
        </div>
    );
};

export default PasswordForgot;
