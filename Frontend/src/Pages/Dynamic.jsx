import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../Layout/Header"
import Footer from "../Layout/Footer";
const StaticZupeePage = ({ page }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const toggle = (index) => { setOpenIndex(openIndex === index ? null : index); };

    const [other, setOther] = useState([]);
    const API = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchOther = async () => {
            try {
                const res = await fetch(`${API}/api/admin/other`, {
                    credentials: "include",
                });
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    setOther(data.data);
                    console.log("Other data:", data.data);
                } else {
                    setOther([]); // empty array agar data nahi hai
                    console.log("Other data empty array");
                }
            } catch (error) {
                console.error("Error fetching other:", error);
                setOther([]); // error me bhi empty array
            }
        };
        fetchOther();
    }, []);


    const colour = {
        breadcrumbColour: '#f0f3fc',
        heroSectionColour: "white",
        buttonColour: '#4b0fbf',
        pages_1Colour: '#fbea06',
        pages_2Colour: '#fbea06',
        termsColour: 'white',
        teamColour: 'white',
        contactColour: 'white',
        contactInputColour: '#f0f3fc',
        contactbtnColour: '#facc15',
        faqColour: '#f0f3fc',
    }


    return (
        <>
            <Header other={other} />
            <div className="flex mt-20 min-h-screen font-sans text-[#1d141e]">
                {/* Main Content */}
                <div className="flex-1 bg-white" style={{ background: colour.heroSectionColour || 'white' }}>
                    {/* 1. Breadcrumb */}
                    {page.breadcrumb && (page.breadcrumb.home || page.breadcrumb.current) && (
                        <div
                            className="text-2xl p-4 sm:p-5"
                            style={{ background: colour.breadcrumbColour || "#f0f3fc" }}
                        >
                            <div className="max-w-6xl mx-auto text-center md:text-left">
                                <Link to="/" className="font-semibold text-purple-700">
                                    {page.breadcrumb.home || 'Home'}
                                </Link>{' '}
                                &gt; <span>{page.breadcrumb.current || page.page}</span>
                            </div>
                        </div>
                    )}

                    {/* 2. Hero Section */}
                    {page.hero &&
                        (page.hero.heading ||
                            page.hero.button?.text ||
                            page.hero.button?.link ||
                            page.hero.image) && (
                            <section className="flex flex-col lg:flex-row items-center justify-center lg:justify-between lg:ml-20 gap-8 p-5 sm:p-8">
                                {/* Left Section */}
                                <div className="flex flex-col items-center lg:items-start justify-center p-5 lg:p-10 gap-5 text-center lg:text-left w-full lg:w-1/2">
                                    {/* ✅ Heading */}
                                    {page.hero.heading && (
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold italic text-[#342491]">
                                            {page.hero.heading}
                                        </h1>
                                    )}

                                    {/* ✅ Download Button */}
                                    {(page.hero.button?.text || page.hero.button?.link) && (
                                        <div
                                            className="relative rounded-full flex justify-center w-full sm:w-[20rem] md:w-[25rem] lg:w-[30rem] overflow-hidden"
                                            style={{ background: colour.buttonColour || '#4b0fbf' }}
                                        >
                                            <a
                                                href={page.hero.button?.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 p-4 relative z-10"
                                            >
                                                {page.hero.button?.link && (
                                                    <img
                                                        src={page.hero.button?.link}
                                                        alt="Download Icon"
                                                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
                                                    />
                                                )}
                                                {page.hero.button?.text && (
                                                    <span className="text-white font-semibold text-sm sm:text-base md:text-lg">
                                                        {page.hero.button.text}
                                                    </span>
                                                )}
                                            </a>

                                            {/* Shining Overlay */}
                                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                                <div className="absolute -top-1/2 -left-1/2 w-[120%] h-[300%] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-12 shine"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Inline Keyframes */}
                                    <style jsx>{`
              @keyframes shine {
                0% {
                  transform: translateX(-100%) rotate(60deg);
                }
                100% {
                  transform: translateX(100%) rotate(130deg);
                }
              }
              .shine {
                animation: shine 2.5s ease-in-out infinite;
              }
            `}</style>
                                </div>

                                {/* ✅ Right Section (Image) */}
                                {page.hero.image && (
                                    <div className="mt-8 lg:mt-0 w-full lg:w-1/2 flex justify-center">
                                        <img
                                            src={page.hero.image}
                                            alt="Hero Image"
                                            className="h-64 sm:h-80 md:h-[35rem] lg:h-[40rem] object-contain"
                                        />
                                    </div>
                                )}
                            </section>
                        )}

                    {/* 3. Image Row Section */}
                    {page.images && page.images.cards && page.images.cards.length > 0 && (
                        <section style={{ background: colour.pages_1Colour || '#fbea06' }} className="py-12">
                            <div
                                className="mx-auto p-5 lg:p-10 max-w-7xl"
                                style={{ background: colour.pages_2Colour || '#fbea06' }}
                            >
                                <h2 className="text-2xl sm:text-3xl md:text-6xl font-extrabold italic text-purple-800 text-center mb-12">
                                    {page.images.title}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {page.images.cards.map((cards, index) => (
                                        <div
                                            key={cards._id || index}
                                            className="flex flex-col items-center text-center"
                                        >
                                            <div className="w-32 sm:w-36 md:w-40 lg:w-48 ">
                                                <img
                                                    src={cards.image}
                                                    alt={cards.title || 'Card Image'}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <p className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-purple-900">
                                                {cards.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 4 Terms and Team */}
                    {page.content &&
                        page.content.length > 0 &&
                        page.content.map((section, secIdx) => {
                            const hasValidTerms =
                                section.terms &&
                                ((section.terms.title && section.terms.title.trim() !== '') ||
                                    (section.terms.subtitles &&
                                        section.terms.subtitles.some(
                                            (sub) =>
                                                sub.subtitle?.trim() !== '' ||
                                                (sub.points && sub.points.length > 0)
                                        )));

                            const hasValidTeam =
                                section.team &&
                                section.team.length > 0 &&
                                section.team.some(
                                    (block) =>
                                        block.members &&
                                        block.members.length > 0 &&
                                        block.members.some((m) => m.name?.trim() !== '')
                                );

                            if (!hasValidTerms && !hasValidTeam) return null;

                            return (
                                <div key={secIdx}>
                                    {/* ✅ Render Terms Section if valid */}
                                    {hasValidTerms && (
                                        <section
                                            className="px-6 md:px-12 py-12"
                                            style={{ background: colour.termsColour || 'white' }}
                                        >
                                            {section.terms.title?.trim() && (
                                                <h1 className="text-3xl sm:text-6xl font-bold italic text-center mb-10 text-purple-800">
                                                    {section.terms.title}
                                                </h1>
                                            )}

                                            {section.terms.subtitles && section.terms.subtitles.length > 0 && (
                                                <div className="max-w-7xl mx-auto text-gray-800 space-y-8">
                                                    {section.terms.subtitles.map((sub, subIdx) => {
                                                        const hasSubtitleOrPoints =
                                                            sub.subtitle?.trim() !== '' ||
                                                            (sub.points && sub.points.length > 0);

                                                        if (!hasSubtitleOrPoints) return null;

                                                        return (
                                                            <div key={subIdx}>
                                                                {sub.subtitle?.trim() && (
                                                                    <h2 className="text-xl sm:text-4xl font-bold italic text-center text-[#42149e] mb-4">
                                                                        {sub.subtitle}
                                                                    </h2>
                                                                )}

                                                                {sub.points && sub.points.length > 0 && (
                                                                    <ul
                                                                        className={`pl-6 space-y-2 text-sm sm:text-2xl leading-relaxed ${sub.points.filter(
                                                                            (point) =>
                                                                                point.text?.trim() !== '' ||
                                                                                (point.subpoints &&
                                                                                    point.subpoints.some(
                                                                                        (sp) => sp?.trim() !== ''
                                                                                    ))
                                                                        ).length >= 3
                                                                            ? 'list-decimal'
                                                                            : ''
                                                                            }`}
                                                                    >
                                                                        {sub.points.map((point, pIdx) => {
                                                                            const hasPointText =
                                                                                point.text?.trim() !== '' ||
                                                                                (point.subpoints && point.subpoints.length > 0);
                                                                            if (!hasPointText) return null;

                                                                            return (
                                                                                <li key={pIdx}>
                                                                                    {point.text?.trim()}
                                                                                    {point.subpoints &&
                                                                                        point.subpoints.length > 0 && (
                                                                                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                                                                                {point.subpoints
                                                                                                    .filter((sp) => sp?.trim() !== '')
                                                                                                    .map((sp, spIdx) => (
                                                                                                        <li key={spIdx}>{sp}</li>
                                                                                                    ))}
                                                                                            </ul>
                                                                                        )}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <hr className="my-10 border-[#9f9f9f]" />
                                        </section>
                                    )}

                                    {/* ✅ Render Team Section if valid */}
                                    {hasValidTeam && (
                                        <section
                                            className="px-6 md:px-12 lg:px-20 py-12"
                                            style={{ background: colour.teamColour || 'white' }}
                                        >
                                            {section.team[0]?.title?.trim() && (
                                                <h2 className="text-2xl sm:text-3xl md:text-6xl font-extrabold italic text-purple-800 text-center mb-12">
                                                    {section.team[0].title}
                                                </h2>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
                                                {section.team.map((teamBlock, tIdx) =>
                                                    teamBlock.members?.map((m, mIdx) =>
                                                        m.name?.trim() ? (
                                                            <div
                                                                key={m._id || `${tIdx}-${mIdx}`}
                                                                className="space-y-4"
                                                            >
                                                                <div className="w-full h-auto overflow-hidden rounded-lg transition-all duration-500 hover:rounded-tl-[8rem] hover:rounded-br-[8rem] relative flex items-center justify-center bg-gray-200">
                                                                    {m.image && (
                                                                        <img
                                                                            src={m.image}
                                                                            alt={m.name}
                                                                            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                                                        />
                                                                    )}
                                                                </div>

                                                                <h3 className="text-base sm:text-lg md:text-2xl font-bold text-purple-800 uppercase italic">
                                                                    {m.name} {m.role && `– ${m.role}`}
                                                                </h3>
                                                                {m.description && (
                                                                    <p className="text-gray-700 text-sm sm:text-lg leading-relaxed">
                                                                        {m.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : null
                                                    )
                                                )}
                                            </div>

                                            <hr className="my-10 border-[#9293a5]" />
                                        </section>
                                    )}
                                </div>
                            );
                        })}

                    {/* 5. Contact Form Section */}
                    {page.contactForm &&
                        page.contactForm.fields &&
                        page.contactForm.fields.length > 0 && (
                            <section style={{ background: colour.contactColour || 'white' }} className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-16 rounded-2xl my-10">
                                {/* Heading */}
                                <p className="text-center text-3xl sm:text-4xl md:text-6xl font-bold text-gray-700 opacity-90 mb-12">
                                    {page.contactForm.heading}
                                </p>

                                {/* Form */}
                                <form className="space-y-6 sm:space-y-8 ">
                                    {page.contactForm.fields.map((field, index) =>
                                        field.type === 'textarea' ? (
                                            <textarea
                                                key={field._id || index}
                                                placeholder={field.placeholder}
                                                name={field.name}
                                                required={field.required}
                                                style={{ background: colour.contactInputColour || '#f0f3fc' }}
                                                className="w-full px-6 py-4 sm:py-5 rounded-lg  border border-gray-300 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                rows={field.rows || 5}
                                                minLength={field.minLength || 20}
                                            ></textarea>
                                        ) : (
                                            <input
                                                key={field._id || index}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                name={field.name}
                                                required={field.required}
                                                style={{ background: colour.contactInputColour || '#f0f3fc' }}
                                                className="w-full px-6 py-4 sm:py-5 rounded-lg  border border-gray-300 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                minLength={field.minLength || ''}
                                            />
                                        )
                                    )}

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto hover:bg-yellow-500 text-purple-900 font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-full shadow-lg transition duration-300 text-base sm:text-lg md:text-xl"
                                            style={{ background: colour.contactbtnColour || '#facc15' }}
                                        >
                                            Send Your Query!
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}

                    {/* 7. FAQ Section */}
                    {page.faqs && page.faqs.faqsList && page.faqs.faqsList.length > 0 && (
                        <section
                            className="w-full py-10 sm:py-14 px-4 sm:px-8 lg:px-12"
                            style={{ background: colour.faqColour || '#f0f3fc' }}
                        >
                            <div className="max-w-6xl mx-auto">
                                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-center text-[#4611a6] mb-8 sm:mb-12 drop-shadow-sm">
                                    {page.faqs.heading}
                                </h2>

                                <div className="w-full max-w-6xl mx-auto">
                                    {page.faqs.faqsList.map((faq, index) => (
                                        <div
                                            key={faq._id || index}
                                            className="border-b-2 border-gray-300 overflow-hidden"
                                        >
                                            <div
                                                onClick={() => toggle(index)}
                                                className="flex justify-between items-center p-3 sm:p-5 cursor-pointer hover:bg-gray-50 transition"
                                            >
                                                <h1 className="font-bold sm:font-bold text-base sm:text-lg lg:text-3xl text-gray-900 leading-snug">
                                                    {faq.question}
                                                </h1>
                                                {openIndex === index ? (
                                                    <FaChevronUp className="text-[#342491] text-lg sm:text-xl" />
                                                ) : (
                                                    <FaChevronDown className="text-[#342491] text-lg sm:text-xl" />
                                                )}
                                            </div>

                                            <div
                                                className={`transition-all duration-500 ease-in-out transform ${openIndex === index
                                                    ? 'max-h-96 opacity-100 translate-y-0'
                                                    : 'max-h-0 opacity-0 -translate-y-2'
                                                    } overflow-hidden`}
                                            >
                                                <p className="p-3 sm:p-5 text-gray-700 text-sm sm:text-base lg:text-2xl font-medium leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <Footer other={other} />
        </>
    );
};

export default StaticZupeePage;
