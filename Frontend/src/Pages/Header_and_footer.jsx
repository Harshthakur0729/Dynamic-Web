import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./Sidebar";

const MenuManager = () => {
    const [pages, setPages] = useState([]);
    const [otherData, setOtherData] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const API = import.meta.env.VITE_BACKEND_URL;
    console.log("oooooooooo", otherData);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        fetchPages();
        fetchOther();
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchPages = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/getData`, { withCredentials: true });
            if (res.data.success) {
                setPages(res.data.data);
            }
        } catch (err) {
            console.error("Fetch pages failed:", err);
        }
    };

    const fetchOther = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/other`, { withCredentials: true });
            if (res.data.success && Array.isArray(res.data.data)) {
                setOtherData(res.data.data);
            } else {
                setOtherData([]);
            }
        } catch (err) {
            console.error("Fetch other failed:", err);
            setOtherData([]);
        }
    };

    const handleCheckboxChange = async (pageId, field, checked) => {
        try {
            const page = pages.find((p) => p._id === pageId);
            const updated = {
                ...page,
                menuPlacement: {
                    ...page.menuPlacement,
                    [field]: checked,
                },
            };

            await axios.put(
                `${API}/api/admin/dynamic/update/${pageId}`,
                { menuPlacement: updated.menuPlacement },
                { withCredentials: true }
            );

            setPages((prev) =>
                prev.map((p) =>
                    p._id === pageId ? { ...p, menuPlacement: updated.menuPlacement } : p
                )
            );
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleOtherCheck = async (id) => {
        try {
            // ✅ sirf ek row check hoga, baki false
            const updatedData = otherData.map((item) => ({
                ...item,
                check: item._id === id, // selected row true, baki false
            }));

            // Backend update - har row ko update karna hoga
            for (const item of updatedData) {
                await axios.put(
                    `${API}/api/admin/other/update/${item._id}`,
                    { check: item.check },
                    { withCredentials: true }
                );
            }

            // State update
            setOtherData(updatedData);
        } catch (err) {
            console.error("Update other check failed:", err);
        }
    };


    return (
        <div className="p-4 relative">
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} menuRef={menuRef} refresh={fetchPages} />
            <button
                className="mb-4 p-2 rounded-md bg-purple-600 text-white shadow hover:bg-purple-700 transition"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <GiHamburgerMenu size={28} />
            </button>

            <h2 className="text-xl font-bold mb-4">Manage Menu Placement</h2>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border p-2">Page</th>
                        <th className="border p-2">Show in Header</th>
                        <th className="border p-2">Show in Footer</th>
                        <th className="border p-2">Show in Dropdown</th>
                        <th className="border p-2">Top Pages</th>
                    </tr>
                </thead>
                <tbody>
                    {pages.map((page) => (
                        <tr key={page._id}>
                            <td className="border p-2">{page.page || page.title}</td>
                            <td className="border p-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={page.menuPlacement?.header || false}
                                    onChange={(e) => handleCheckboxChange(page._id, "header", e.target.checked)}
                                />
                            </td>
                            <td className="border p-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={page.menuPlacement?.footer || false}
                                    onChange={(e) => handleCheckboxChange(page._id, "footer", e.target.checked)}
                                />
                            </td>
                            <td className="border p-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={page.menuPlacement?.dropdown || false}
                                    onChange={(e) => handleCheckboxChange(page._id, "dropdown", e.target.checked)}
                                />
                            </td>
                            <td className="border p-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={page.menuPlacement?.top_pages || false}
                                    onChange={(e) => handleCheckboxChange(page._id, "top_pages", e.target.checked)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-xl font-bold mb-4">Other Data</h2>
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border p-2">Header Logo</th>
                        <th className="border p-2">Footer Logo</th>
                        <th className="border p-2">Text</th>
                        <th className="border p-2">Info</th>
                        <th className="border p-2">Check</th>
                    </tr>
                </thead>
                <tbody>
                    {otherData.map((item) => (
                        <tr key={item._id}>
                            <td className="border p-2 text-center">
                                {item.logo?.header_logo ? (
                                    <img src={item.logo.header_logo} alt="Header Logo" className="h-12 mx-auto" />
                                ) : "N/A"}
                            </td>
                            <td className="border p-2 text-center">
                                {item.logo?.footer_logo ? (
                                    <img src={item.logo.footer_logo} alt="Footer Logo" className="h-12 mx-auto" />
                                ) : "N/A"}
                            </td>
                            <td className="border p-2 text-center">
                                <h1 className="font-bold">{item.text || "-"}</h1>
                            </td>
                            <td className="border p-2 text-center">
                                <h1 className="font-bold">{item.info || "-"}</h1>
                            </td>
                            <td className="border p-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={item.check || false}
                                    onChange={() => handleOtherCheck(item._id)} // id pass karna kaafi hai
                                />
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default MenuManager;
