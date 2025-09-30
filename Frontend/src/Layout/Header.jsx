import React, { useState, useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { GoX, GoChevronDown } from "react-icons/go";
import { Link } from "react-router-dom";

export default function ResponsiveHeader({ other }) {
  const API = import.meta.env.VITE_BACKEND_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState([]);
  const pageArray = (Array.isArray(page) ? page : [page])
  const otherArray = (Array.isArray(other) ? other : [other])

  const sidebarRef = useRef(null);
  // console.log("Headerpage", page, "Headerpage Array", pageArray);

  console.log("other", otherArray);


  useEffect(() => {
    const fetchDynamicRoutes = async () => {
      try {
        const response = await fetch(`${API}/api/admin/getData`, { withCredentials: true, });
        const data = await response.json();
        console.log("Dynamic Routes Data:", data);

        if (data.success && Array.isArray(data.data)) {
          setPage(data.data);
        } else {
          setPage([]);
        }
      } catch (error) {
        console.error("Error fetching dynamic routes:", error);
        setPage([]);
      }
    };
    fetchDynamicRoutes();
  }, []);

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  return (
    <header className="w-full bg-yellow-300 shadow-md fixed top-0 left-0 z-50">
      <div className="flex justify-between md:justify-around items-center px-6 py-4">
        {/* Logo */}
        <Link to={`/${page.page}`}>
          {otherArray.filter((item) => item.check).map((items) => (
            <img
              key={items._id}
              src={items.logo.header_logo}
              alt="Header Logo"
              className="h-10 md:h-12 cursor-pointer"
            />
          ))}


        </Link>


        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-purple-900 font-bold uppercase">
          {/* Dropdown */}
          <div className="relative group cursor-pointer flex items-center gap-1">
            <span>MENU</span>
            <GoChevronDown />
            <div className="absolute left-0 top-5 mt-1 bg-yellow-300 border-1 text-purple-900 duration-1000 shadow-lg rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition  ease-in-out z-50 min-w-[220px]">
              { // ensure it's array
                pageArray.filter((item) => item.menuPlacement?.dropdown) // only dropdown=true
                  .map((i) => (
                    <div
                      key={i._id || i.page}
                      className="px-4 py-2 rounded-lg whitespace-nowrap hover:bg-yellow-400 transition"
                    >
                      <Link to={`/${i.page}`}>
                        {i?.breadcrumb?.current || i.page || "Menu Item"}
                      </Link>
                    </div>
                  ))}
            </div>
          </div>
          {/* Other Links */}
          {pageArray
            .filter((item) => item.menuPlacement?.header) // only header=true
            .map((items) => (
              <Link
                key={items._id || items.page}
                to={`/${items.page}`}
                className="cursor-pointer"
              >
                {items?.breadcrumb?.current || items.page || "Header Item"}
              </Link>
            ))}

        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-purple-900 text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <GoX /> : <IoMenu />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div
          ref={sidebarRef}
          className="fixed top-0 right-0 h-full w-64 bg-yellow-300 text-purple-900 shadow-lg transform transition-transform duration-300 z-50"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <img
              src="https://assets.zupee.com/zupee-revamp/assets/zupee-logo-v1.webp"
              alt="Zupee Logo"
              className="h-10"
            />
            <button onClick={() => setIsOpen(false)} className="text-3xl">
              <GoX />
            </button>
          </div>

          <nav className="flex flex-col gap-4 p-6 font-bold uppercase">
            {/* Zupee Games Subitems */}
            {pageArray.filter((item) => item.menuPlacement?.dropdown).map((items) => (
              <div key={items._id} className="ml-2 mt-4 flex flex-col gap-2">
                <Link onClick={() => setIsOpen(false)} className="text-sm py-1 cursor-pointer" to={`/${items.page}`}>{items?.breadcrumb?.current || items?.page}</Link>
              </div>
            ))}

            {pageArray
              .filter((item) => item.menuPlacement?.header) // only header=true
              .map((items) => (
                <Link
                  key={items._id || items.page}
                  onClick={() => setIsOpen(false)}
                  to={`/${items.page}`}
                  className="py-2 cursor-pointer"
                >
                  {items?.breadcrumb?.current || items.page || "Header Item"}
                </Link>
              ))}


          </nav>
        </div>
      )}
    </header>
  );
}
