import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // or next/link if using Next.js

export default function Footer({ other }) {

    const [page, setPage] = useState([]);
    const pageArray = (Array.isArray(page) ? page : [page])
    const otherArray = (Array.isArray(other) ? other : [other])
    console.log("footer", otherArray);

    useEffect(() => {
        const fetchDynamicRoutes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getData`);
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
    console.log("Footerpage", page, "Footerpage Array", pageArray);

    return (
        <footer className="bg-[#4611a7] text-white">
            {/* Top Section */}
            <div className="container mx-auto px-6 py-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-10">
                {/* Info Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Info</h1>
                    {pageArray.filter((item) => item.menuPlacement.footer).map((items) => (
                        <Link key={items._id} to={`/${items.page}`} className="hover:underline cursor-pointer">
                            {items?.breadcrumb?.current || items?.page}
                        </Link>
                    ))}
                </div>

                {/* Top Pages */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Top Pages</h1>
                    {pageArray.filter((item) => item.menuPlacement?.dropdown).map((items) => (
                        <Link key={items._id} className="hover:underline cursor-pointer" to={`/${items.page}`}>{items?.breadcrumb?.current || items?.page}</Link>
                    ))}
                </div>

                {/* Games Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Games</h1>
                    <Link to="/" className="hover:underline cursor-pointer">
                        Ludo
                    </Link>
                    <Link to="#" className="hover:underline cursor-pointer">
                        Ludo Hindi
                    </Link>
                </div>
            </div>
            {/* Divider */}
            <hr className="border-t border-white mx-auto w-11/12" />
            {/* Bottom Section */}
            <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
                {otherArray.filter((item) => item.check).map((items) => (
                    <img
                        key={items._id}
                        src={items.logo.footer_logo}
                        alt="Footer Logo"
                        className="h-10 md:h-12 cursor-pointer"
                    />
                ))}

                {otherArray.filter((item) => item.check).map((items) => (
                    <p className="text-sm md:text-base text-center md:text-left">
                        © {items.text}
                    </p>
                ))}
            </div>
        </footer>
    );
}
