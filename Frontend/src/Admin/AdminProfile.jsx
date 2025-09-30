import { useEffect, useRef, useState } from "react";
import Sidebar from "../Pages/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

const AdminProfile = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [adminData, setAdminData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        profileImage: null,
    });

    // Close sidebar on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch admin data
    const fetchAdminData = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/data`, { withCredentials: true });
            if (res.data && res.data.success) {
                setAdminData(res.data.admin);
                setFormData({
                    username: res.data.admin.username || "",
                    email: res.data.admin.email || "",
                    oldPassword: "",
                    newPassword: "",
                    profileImage: null,
                });
            } else {
                setAdminData(null);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
            setAdminData(null);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profileImage") {
            setFormData({ ...formData, profileImage: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!adminData?._id) return;

        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        if (formData.oldPassword) data.append("oldPassword", formData.oldPassword);
        if (formData.newPassword) data.append("newPassword", formData.newPassword);
        if (formData.profileImage) data.append("profileImage", formData.profileImage);

        try {
            const res = await axios.put(`${API}/api/admin/update/${adminData._id}`, data, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                Swal.fire("Success", res.data.message, "success");
                fetchAdminData();

                setEditMode(false);
                setFormData({ ...formData, oldPassword: "", newPassword: "", profileImage: null });
            } else {
                Swal.fire("Error", res.data.message || "Update failed", "error");
            }
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire("Error", "Update failed", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Sidebar button stays fixed on top-left */}
            <div className="absolute top-4 left-4 z-50">
                <button
                    className="p-2 rounded-md bg-purple-600 text-white shadow hover:bg-purple-700 transition flex items-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <GiHamburgerMenu size={28} />
                </button>
            </div>

            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} menuRef={menuRef} refresh={fetchAdminData} />

            {/* Centered Profile Card */}
            <div className="flex justify-center items-start pt-24 bg-gradient-to-b from-purple-100 to-white min-h-screen">
                {adminData ? (
                    <div className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-purple-200 rounded-3xl shadow-2xl p-8 hover:scale-[1.02] transition-transform duration-300">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-extrabold text-purple-700 tracking-wide">Admin Profile</h2>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition transform"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {/* Profile Image */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-purple-300 mb-3">
                                    <img
                                        src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : adminData.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {editMode && (
                                    <input
                                        type="file"
                                        name="profileImage"
                                        onChange={handleChange}
                                        className="mt-2 text-sm text-purple-600 font-medium"
                                    />
                                )}
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full border border-purple-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none shadow-sm"
                                    readOnly={!editMode}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-purple-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none shadow-sm"
                                    readOnly={!editMode}
                                />
                            </div>

                            {/* Password Section */}
                            {editMode && (
                                <div className="space-y-4 bg-purple-50/50 p-4 rounded-2xl border border-purple-200 shadow-inner">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="oldPassword">Old Password</label>
                                        <input
                                            type="password"
                                            id="oldPassword"
                                            name="oldPassword"
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            placeholder="Enter old password"
                                            className="w-full border border-purple-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none shadow-sm"
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="newPassword">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            className="w-full border border-purple-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none shadow-sm"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div>
                                        <Link
                                            to="/forgot-password"
                                            className="text-purple-600 font-semibold hover:underline"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            {editMode && (
                                <div className="flex space-x-4 mt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition transform font-semibold"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 bg-gray-300 text-gray-800 p-3 rounded-2xl shadow hover:scale-105 transition transform font-semibold"
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                username: adminData.username || "",
                                                email: adminData.email || "",
                                                oldPassword: "",
                                                newPassword: "",
                                                profileImage: null,
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    <p className="text-gray-500 text-lg">No admin data available.</p>
                )}
            </div>

        </div>
    );
};

export default AdminProfile;
