import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const NewPassword = () => {
    const [data, setData] = useState({ otp: "", newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // Check login token
    const authToken = Cookies.get("token"); // Assuming this is your login token cookie
    const resetToken = Cookies.get("passwordResetToken"); // OTP reset token

    const handleInput = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleForm = async (e) => {
        e.preventDefault();

        if (!data.otp || !data.newPassword || !data.confirmPassword) {
            return Swal.fire("Warning", "All fields are required.", "warning");
        }

        if (data.newPassword !== data.confirmPassword) {
            return Swal.fire("Warning", "Passwords do not match.", "warning");
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${API}/api/admin/reset-password`,
                {
                    otp: data.otp,
                    newPassword: data.newPassword,
                    confirmpassword: data.confirmPassword,
                },
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${resetToken}` },
                }
            );

            Swal.fire("Success", res.data.message || "Password reset successful!", "success").then(() => {
                // Redirect based on login status
                if (authToken) {
                    navigate("/admin/profile");
                } else {
                    navigate("/admin/login");
                }
            });

            setData({ otp: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error("Failed:", error);
            Swal.fire(
                "Error",
                error.response?.data?.message || "Invalid OTP or server issue.",
                "error"
            );
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
                <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>

                <input
                    type="text"
                    name="otp"
                    placeholder="Enter your OTP"
                    value={data.otp}
                    onChange={handleInput}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-purple-500"
                />

                <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={data.newPassword}
                    onChange={handleInput}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-purple-500"
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={data.confirmPassword}
                    onChange={handleInput}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-purple-500"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                        } transition`}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default NewPassword;
