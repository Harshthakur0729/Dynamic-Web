import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";

const defaultFontWeights = [
    "100", "200", "300", "400", "500", "600", "700", "800", "900",
    "thin", "extra-light", "light", "normal", "medium", "semi-bold", "bold", "extra-bold", "black"
];

const defaultFontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana",
    "Tahoma", "Trebuchet MS", "Impact", "Comic Sans MS", "Lucida Console"
];



const StyleForm = () => {
    const [formData, setFormData] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const API = import.meta.env.VITE_BACKEND_URL;

    const fetchInitialStyles = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/style/getData`, { withCredentials: true });
            if (res.data.data) {
                setFormData(res.data.data);
            } else {
                setFormData({});
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setFormData({});
            } else {
                Swal.fire("Error", "Failed to fetch data: " + err.message, "error");
            }
        }
    };

    console.log("Data", formData);


    useEffect(() => { fetchInitialStyles(); }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (section, key, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [key]: value }
        }));
    };

    const handleSave = async () => {
        try {
            const method = Object.keys(formData).length ? "put" : "post";
            const endpoint = Object.keys(formData).length ? "update" : "create";

            await axios[method](`${API}/api/admin/style/${endpoint}`, formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            Swal.fire("Success", `Style ${endpoint === "update" ? "updated" : "created"} successfully!`, "success");
        } catch (err) {
            const msg = err.response
                ? `Status ${err.response.status}: ${err.response.data?.message || err.message}`
                : err.message;
            Swal.fire("Error", "Error saving style: " + msg, "error");
        }
    };


    const handleReset = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will reset all styles to default!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, reset it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API}/api/admin/style/delete`, { withCredentials: true });
                fetchInitialStyles();
                Swal.fire("Reset!", "Styles have been reset to default.", "success");
            } catch (err) {
                const msg = err.response
                    ? `Status ${err.response.status}: ${err.response.data?.message || err.message}`
                    : err.message;
                Swal.fire("Error", "Error resetting style: " + msg, "error");
            }
        }
    };



    // Input components
    const SuggestionInput = ({ section, field, value }) => (
        <input
            list={`${section}-${field}-list`}
            value={value || ""}
            onChange={e => handleChange(section, field, e.target.value)}
            className="border p-2 rounded w-full"
        />
    );

    const sections = [
        {
            name: "headerSection",
            fields: [
                { key: "headerbgColour", type: "color" },
                { key: "headerfontColour", type: "color" },
                { key: "headerfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "headerfontfamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "headerfontSize", type: "number", range: { min: 0, max: 200 } }
            ]
        },
        {
            name: "footerSection",
            fields: [
                { key: "footerColour", type: "color" },
                { key: "headingfontColour", type: "color" },
                { key: "headingfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "headingfontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "headingfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "headingRoutesfontColour", type: "color" },
                { key: "headingRoutesfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "headingRoutesfontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "headingRoutesfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "CopyrightfontColour", type: "color" },
                { key: "CopyrightfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "CopyrightfontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "CopyrightfontFamily", type: "fontFamily", options: defaultFontFamilies }
            ]
        },
        {
            name: "breadcrumbSection",
            fields: [
                { key: "breadcrumbColour", type: "color" },
                { key: "breadcrumbfontsize", type: "number", range: { min: 0, max: 200 } },
                { key: "breadcrumbfontColour_1", type: "color" },
                { key: "breadcrumbfontColour_2", type: "color" },
                { key: "breadcrumb_fontWeight_1", type: "fontWeight", options: defaultFontWeights },
                { key: "breadcrumb_fontWeight_2", type: "fontWeight", options: defaultFontWeights },
                { key: "breadcrumbfontfamily_1", type: "fontFamily", options: defaultFontFamilies },
                { key: "breadcrumbfontfamily_2", type: "fontFamily", options: defaultFontFamilies }
            ]
        },
        {
            name: "heroSection",
            fields: [
                { key: "herobgColour", type: "color" },
                { key: "herofontColour", type: "color" },
                { key: "herofontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "herofontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "herobtnfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "herobtnfontColour", type: "color" },
                { key: "herobtnfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "buttonColour", type: "color" }
            ]
        },
        {
            name: "imageSection",
            fields: [
                { key: "pagesbg1", type: "color" }, // if image, can extend later
                { key: "pagesbg2", type: "color" },
                { key: "imgheadingFontColour", type: "color" },
                { key: "imgheadingFontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "imgheadingFontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "imgfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "imgfontColour", type: "color" },
                { key: "imgfontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "imgfontFamily", type: "fontFamily", options: defaultFontFamilies }
            ]
        },
        {
            name: "termsSection",
            fields: [
                { key: "termsbgColour", type: "color" },
                { key: "titlefontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "titlefontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "titlefontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "titlefontColour", type: "color" },
                { key: "subtitlefontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "subtitlefontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "subtitlefontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "subtitlefontColour", type: "color" },
                { key: "pointfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "pointfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "pointfontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "pointfontColour", type: "color" },
                { key: "subpointfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "subpointfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "subpointfontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "subpointfontColour", type: "color" }
            ]
        },
        {
            name: "teamSection",
            fields: [
                { key: "teambgColour", type: "color" },
                { key: "titlefontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "titlefontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "titlefontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "titlefontColour", type: "color" },
                { key: "name_role_fontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "name_role_fontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "name_role_fontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "name_role_fontColour", type: "color" },
                { key: "descriptionfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "descriptionfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "descriptionfontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "descriptionfontColour", type: "color" }
            ]
        },
        {
            name: "contactSection",
            fields: [
                { key: "contactColour", type: "color" },
                { key: "contactheadingfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "contactheadingfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "contactheadingfontColour", type: "color" },
                { key: "contactInputbgColour", type: "color" },
                { key: "contactinputFontColour", type: "color" },
                { key: "contactinputFontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "contactbtnbgColour", type: "color" },
                { key: "contactbtnColour", type: "color" },
                { key: "contactbtnFontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "contactbtnFontWeight", type: "fontWeight", options: defaultFontWeights }
            ]
        },
        {
            name: "faqSection",
            fields: [
                { key: "faqbgColour", type: "color" },
                { key: "faqheadingfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "faqheadingfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "faqheadingfontColour", type: "color" },
                { key: "faqQfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "faqQfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "faqQfontColour", type: "color" },
                { key: "faqQfontSize", type: "number", range: { min: 0, max: 200 } },
                { key: "faqAfontWeight", type: "fontWeight", options: defaultFontWeights },
                { key: "faqAfontFamily", type: "fontFamily", options: defaultFontFamilies },
                { key: "faqAfontColour", type: "color" },
                { key: "faqAfontSize", type: "number", range: { min: 0, max: 200 } }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
            {/* Sidebar */}
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} menuRef={menuRef} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Hamburger */}
                <button
                    className="m-4 p-3 w-13 rounded-xl fixed bg-purple-600 text-white shadow-xl hover:bg-purple-700 transition duration-300"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <GiHamburgerMenu size={28} />
                </button>

                {/* Page container */}
                <div className="max-w-7xl mx-auto p-8">
                    <h1 className="text-5xl font-extrabold mb-12 text-gray-900 tracking-tight border-b-2 border-gray-300 pb-4">
                        Dynamic Style Settings
                    </h1>

                    {/* Sections */}
                    {sections.map(section => (
                        <div
                            key={section.name}
                            className="bg-white rounded-3xl p-8 mb-10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)] transition-shadow duration-300 border border-gray-200"
                        >
                            <h2 className="text-3xl font-semibold mb-8 text-gray-800 bg-gray-50 px-6 py-3 rounded-xl shadow-sm inline-block">
                                {section.name}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-6">
                                {section.fields.map(field => {
                                    const { key, type, options, range } = field;
                                    const value = formData[section.name]?.[key] || "";

                                    if (type === "color") {
                                        return (
                                            <div key={key} className="flex flex-col">
                                                <label className="mb-2 font-medium text-gray-700">{key}</label>
                                                <input
                                                    type="color"
                                                    value={value}
                                                    onChange={e => handleChange(section.name, key, e.target.value)}
                                                    className="w-full h-12 rounded-xl border border-gray-300 cursor-pointer transition-all duration-300 hover:scale-105"
                                                />
                                            </div>
                                        );
                                    }

                                    if (type === "fontWeight" || type === "fontFamily") {
                                        return (
                                            <div key={key} className="flex flex-col">
                                                <label className="mb-2 font-medium text-gray-700">{key}</label>
                                                <SuggestionInput section={section.name} field={key} value={value} />
                                                <datalist id={`${section.name}-${key}-list`}>
                                                    {options.map(opt => <option key={opt} value={opt} />)}
                                                </datalist>
                                            </div>
                                        );
                                    }

                                    if (type === "number") {
                                        return (
                                            <div key={key} className="flex flex-col">
                                                <label className="mb-2 font-medium text-gray-700">{key} (px)</label>
                                                <input
                                                    type="number"
                                                    min={range.min}
                                                    max={range.max}
                                                    value={value}
                                                    onChange={e => handleChange(section.name, key, e.target.value)}
                                                    className="p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300 hover:scale-105"
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={key} className="flex flex-col">
                                            <label className="mb-2 font-medium text-gray-700">{key}</label>
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={e => handleChange(section.name, key, e.target.value)}
                                                className="p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300 hover:scale-105"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-6 mt-8">
                        <button
                            onClick={handleSave}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold transform hover:-translate-y-1"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold transform hover:-translate-y-1"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );

};

export default StyleForm;
