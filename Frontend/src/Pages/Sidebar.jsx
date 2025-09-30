import axios from "axios";
import { useEffect, useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = ({ menuOpen, setMenuOpen, editPage, menuRef, refresh }) => {
  const API = import.meta.env.VITE_BACKEND_URL
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      const res = await axios.post(
        `${API}/api/admin/logout`, {}, { withCredentials: true, });
      if (res.status === 200) navigate("/admin/login");
    } catch (error) {
      console.error("❌ Logout failed:", error.message);
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/getData`, {
        withCredentials: true,
      });
      if (res.data.success && Array.isArray(res.data.data)) setPages(res.data.data);
      else setPages([]);
    } catch (err) {
      console.error("❌ Failed to fetch pages:", err.message);
      setPages([]);
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id) => {
    try {
      const res = await axios.delete(`${API}/api/admin/dynamic/${id}`, {
        withCredentials: true,
      });
      fetchPages();
      Swal.fire("Success", res.data.message || "Page Deleted Successfully", "success");
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data?.message || err.message);
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  useEffect(() => {
    fetchPages();
  }, [refresh]);

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col justify-between ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="font-bold text-xl text-gray-800">Pages</h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <RiCloseLargeFill size={28} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 mb-6">
          <Link
            className="font-semibold text-lg text-gray-700 border-2 border-gray-300 p-2 rounded-xl hover:bg-gray-100 transition"
            to="/admin/profile"
          >
            Admin Profile
          </Link>

          <Link
            className="font-semibold text-lg text-gray-700 border-2 border-gray-300 p-2 rounded-xl hover:bg-gray-100 transition"
            to="/"
          >
            Create Route's
          </Link>

          <Link
            className="font-semibold text-lg text-gray-700 border-2 border-gray-300 p-2 rounded-xl hover:bg-gray-100 transition"
            to="/pageselect"
          >
            Management
          </Link>



          <Link
            className="font-semibold text-lg text-gray-700 border-2 border-gray-300 p-2 rounded-xl hover:bg-gray-100 transition"
            to="/other"
          >
            Logo
          </Link>


        </div>

        {/* Dynamic Pages */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : pages.length === 0 ? (
            <p className="text-gray-500">No Pages Available</p>
          ) : (
            <div className="space-y-2">
              <p className="font-bold text-gray-700 px-2 py-1 border-b">Routes</p>
              {pages.map((p, idx) => (
                <div
                  key={p._id || idx}
                  className="flex justify-between items-center p-2 rounded hover:bg-gray-100 transition cursor-pointer"
                >
                  <span
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/${p.page || p.title}`);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    {p.page || p.title || `Page ${idx + 1}`}
                  </span>

                  {location.pathname === "/" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => editPage(p._id)}
                        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePage(p._id)}
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
        >
          Log out
        </button>
      </div>
    </div>

  );
};

export default Sidebar;
