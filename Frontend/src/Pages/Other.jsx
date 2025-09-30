import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";

const Other = () => {
    const [headerLogo, setHeaderLogo] = useState({ file: null, preview: "" });
    const [footerLogo, setFooterLogo] = useState({ file: null, preview: "" });
    const [text, setText] = useState("");
    const [changeBtn, setChangeBtn] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [records, setRecords] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const API = import.meta.env.VITE_BACKEND_URL + "/api/admin/other";

    // ===== Load all records =====
    const fetchRecords = async () => {
        try {
            const res = await axios.get(API, { withCredentials: true });
            setRecords(res.data.data || []);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch records", "error");
        }
    };
    const fetchPages = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getData`, {
                withCredentials: true,
            });
            if (res.data.success) {
                setPages(res.data.data);
            }
        } catch (err) {
            console.error("Fetch pages failed:", err);
        }
    };
    useEffect(() => {
        fetchPages();
        fetchRecords();
    }, []);

    // ===== Submit Handler =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("text", text);

            if (headerLogo.file) formData.append("headerLogo", headerLogo.file);
            if (footerLogo.file) formData.append("footerLogo", footerLogo.file);

            if (!headerLogo.file && headerLogo.preview) {
                formData.append(
                    "logo",
                    JSON.stringify({ header_logo: headerLogo.preview, footer_logo: footerLogo.preview })
                );
            }

            const url = changeBtn ? `${API}/update/${editingId}` : `${API}/create`;
            const method = changeBtn ? "put" : "post";

            const res = await axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            Swal.fire("Success", res.data.message || "Saved successfully", "success");

            // Reset
            setHeaderLogo({ file: null, preview: "" });
            setFooterLogo({ file: null, preview: "" });
            setText("");
            setChangeBtn(false);
            setEditingId(null);

            fetchRecords();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.response?.data?.message || "Something went wrong!", "error");
        }
    };

    // ===== Edit Handler =====
    const handleEdit = (record) => {
        setEditingId(record._id);
        setHeaderLogo({ file: null, preview: record.logo?.header_logo || "" });
        setFooterLogo({ file: null, preview: record.logo?.footer_logo || "" });
        setText(record.text || "");
        setChangeBtn(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ===== Delete Handler =====
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API}/delete/${id}`, { withCredentials: true });
                Swal.fire("Deleted!", "Record has been deleted.", "success");
                fetchRecords();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete record", "error");
            }
        }
    };

    return (
        <>
            {/* Sidebar & Hamburger */}
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} menuRef={menuRef} refresh={fetchPages} />
            <button
                className="mb-4 p-2 m-5 rounded-md bg-purple-600 text-white shadow hover:bg-purple-700 transition"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <GiHamburgerMenu size={28} />
            </button>

            {/* Main Container */}
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-8">

                {/* Title */}
                <h1 className="text-3xl font-bold text-purple-700">
                    {changeBtn ? "Edit Other Page" : "Add Other Page"}
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Text Field */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">Text</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none resize-none"
                            rows={4}
                        />
                    </div>

                    {/* Header Logo */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">Header Logo</label>
                        <input
                            type="text"
                            placeholder="Or enter image URL"
                            value={headerLogo.preview}
                            onChange={(e) => setHeaderLogo({ file: null, preview: e.target.value })}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none mb-2"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setHeaderLogo({ file, preview: ev.target.result });
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                        />
                        {headerLogo.preview && (
                            <img src={headerLogo.preview} alt="Header Logo" className="w-48 mt-2 rounded-lg shadow-sm" />
                        )}
                    </div>

                    {/* Footer Logo */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">Footer Logo</label>
                        <input
                            type="text"
                            placeholder="Or enter image URL"
                            value={footerLogo.preview}
                            onChange={(e) => setFooterLogo({ file: null, preview: e.target.value })}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none mb-2"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setFooterLogo({ file, preview: ev.target.result });
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                        />
                        {footerLogo.preview && (
                            <img src={footerLogo.preview} alt="Footer Logo" className="w-48 mt-2 rounded-lg shadow-sm" />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                        {changeBtn ? "Update Page" : "Save Page"}
                    </button>
                </form>

                {/* Records Table */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Saved Records</h2>

                    {records.length === 0 ? (
                        <p className="text-gray-500">No records yet.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow-sm">
                            <table className="min-w-full border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 border text-left">Text</th>
                                        <th className="px-4 py-2 border text-left">Header Logo</th>
                                        <th className="px-4 py-2 border text-left">Footer Logo</th>
                                        <th className="px-4 py-2 border text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record) => (
                                        <tr key={record._id} className="text-center hover:bg-gray-50 transition">
                                            <td className="px-4 py-2 border">{record.text}</td>
                                            <td className="px-4 py-2 border">
                                                {record.logo?.header_logo && (
                                                    <img
                                                        src={record.logo.header_logo}
                                                        alt="Header"
                                                        className="w-24 h-12 object-contain mx-auto rounded"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {record.logo?.footer_logo && (
                                                    <img
                                                        src={record.logo.footer_logo}
                                                        alt="Footer"
                                                        className="w-24 h-12 object-contain mx-auto rounded"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border space-x-2">
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record._id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default Other;
