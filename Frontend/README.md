# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.







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
                                            style={{ background: colour.terms.termsColour || 'white' }}
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