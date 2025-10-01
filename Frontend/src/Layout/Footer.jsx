import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // or next/link if using Next.js

export default function Footer({ other, style }) {

    const [page, setPage] = useState([]);
    const pageArray = (Array.isArray(page) ? page : [page])
    const otherArray = (Array.isArray(other) ? other : [other])
    const API = import.meta.env.VITE_BACKEND_URL;
    // console.log("footer", otherArray);

    useEffect(() => {
        const fetchDynamicRoutes = async () => {
            try {
                const response = await fetch(`${API}/api/admin/getData`);
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
    // console.log("Footerpage", page, "Footerpage Array", pageArray);

    return (
        <footer style={{ background: style.footerSection.footerColour || "#4611a7" }} >
            {/* Top Section */}
            <div className="container mx-auto px-6 py-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-10">
                {/* Info Section */}
                <div className="flex flex-col gap-2">
                    <h1
                        style={{
                            color: style.footerSection.headingfontColour || "white",
                            fontWeight: style.footerSection.headingfontWeight || "bold",
                            fontFamily: style.footerSection.headingfontFamily || "",
                            fontSize: `${style.footerSection.headingfontSize}px`
                        }}
                        className="text-2xl "
                    >
                        Info
                    </h1>

                    {otherArray
                        .filter((item) => item.check)
                        .map((items) => {
                            const infoText = items.info || "";
                            const words = infoText.split(" ");

                            // 10 words per line
                            const lines = [];
                            for (let i = 0; i < words.length; i += 10) {
                                lines.push(words.slice(i, i + 10).join(" "));
                            }

                            return (
                                <p
                                    key={items._id}
                                    style={{
                                        color: style.footerSection.CopyrightfontColour || "white",
                                        fontWeight: style.footerSection.CopyrightfontWeight || "light",
                                        fontFamily: style.footerSection.CopyrightfontFamily || "",
                                        fontSize: `${style.footerSection.CopyrightfontSize}px`
                                    }}
                                    className="text-sm md:text-base text-center md:text-left"
                                >
                                    {lines.map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            {index !== lines.length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                            );
                        })}
                </div>



                {/* Top Pages */}
                <div className="flex flex-col gap-2">
                    <h1
                        style={{ color: style.footerSection.headingfontColour || "white", fontWeight: style.footerSection.headingfontWeight || "bold", fontFamily: style.footerSection.headingfontFamily || "", fontSize: `${style.footerSection.headingfontSize}px` }}
                        className="text-2xl ">Top Pages</h1>
                    {pageArray.filter((item) => item.menuPlacement?.dropdown).map((items) => (
                        <Link key={items._id}
                            style={{ color: style.footerSection.headingRoutesfontColour || "white", fontWeight: style.footerSection.headingRoutesfontWeight || "light", fontFamily: style.footerSection.headingRoutesfontFamily || "", fontSize: `${style.footerSection.headingRoutesfontSize}px` }}
                            className="hover:underline cursor-pointer" to={`/${items.page}`}>
                            {items?.breadcrumb?.current || items?.page}
                        </Link>

                    ))}
                </div>

                {/* Other page Section */}

                <div className="flex flex-col gap-2">
                    <h1
                        style={{ color: style.footerSection.headingfontColour || "white", fontWeight: style.footerSection.headingfontWeight || "bold", fontFamily: style.footerSection.headingfontFamily || "", fontSize: `${style.footerSection.headingfontSize}px` }}
                        className="text-2xl">Other pages</h1>
                    {pageArray.filter((item) => item.menuPlacement.footer).map((items) => (
                        <Link key={items._id} to={`/${items.page}`}
                            style={{ color: style.footerSection.headingRoutesfontColour || "white", fontWeight: style.footerSection.headingRoutesfontWeight || "light", fontFamily: style.footerSection.headingRoutesfontFamily || "", fontSize: `${style.footerSection.headingRoutesfontSize}px` }}

                            className="hover:underline cursor-pointer">
                            {items?.breadcrumb?.current || items?.page}
                        </Link>
                    ))}
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
                    <p
                        style={{ color: style.footerSection.CopyrightfontColour || "white", fontWeight: style.footerSection.CopyrightfontWeight || "light", fontFamily: style.footerSection.CopyrightfontFamily || "", fontSize: `${style.footerSection.CopyrightfontSize}px` }}
                        className="text-sm md:text-base text-center md:text-left">
                        © {items.text}
                    </p>
                ))}
            </div>
        </footer>
    );
}
