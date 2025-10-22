import React, { useState, useRef, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";

const PageEditor = () => {
  const [pageTitle, setPageTitle] = useState("");
  const [breadcrumb, setBreadcrumb] = useState("");
  const [hero, setHero] = useState({ heading: "", button: { text: "", link: "" }, image: "", file: null });
  const [images, setImages] = useState([]);
  const [imagesHeading, setImagesHeading] = useState("");
  const [content, setContent] = useState([]);
  const [contactForm, setContactForm] = useState({
    heading: "",
    fields: [],
    button: { text: "Submit" }
  });
  const [faq, setFaq] = useState({ heading: "", faqsList: [] });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [refreshPages, setRefreshPages] = useState(0);
  const [changeBtn, setChangeBtn] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL;
  // ===== Click Outside Sidebar =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== Content Section Handlers =====
  const addTermsSection = () => setContent([...content, { terms: { title: "", subtitles: [] }, team: [] }]);
  const removeTermsSection = (cIdx) => { const newC = [...content]; newC.splice(cIdx, 1); setContent(newC); };
  const addTeamSection = () => setContent([...content, { terms: {}, team: [{ title: "", members: [] }] }]);

  // Terms Handlers
  const addSubtitle = (cIdx) => {
    const newC = [...content];
    if (!newC[cIdx].terms.subtitles) newC[cIdx].terms.subtitles = [];
    newC[cIdx].terms.subtitles.push({ subtitle: "", points: [] });
    setContent(newC);
  };
  const addPoint = (cIdx, sIdx) => { const newC = [...content]; newC[cIdx].terms.subtitles[sIdx].points.push({ text: "", subpoints: [] }); setContent(newC); };
  const addSubpoint = (cIdx, sIdx, pIdx) => { const newC = [...content]; newC[cIdx].terms.subtitles[sIdx].points[pIdx].subpoints.push(""); setContent(newC); };

  const updateTermsTitle = (cIdx, value) => { const newC = [...content]; newC[cIdx].terms.title = value; setContent(newC); };
  const updateSubtitle = (cIdx, sIdx, value) => { const newC = [...content]; newC[cIdx].terms.subtitles[sIdx].subtitle = value; setContent(newC); };
  const updatePoint = (cIdx, sIdx, pIdx, value) => { const newC = [...content]; newC[cIdx].terms.subtitles[sIdx].points[pIdx].text = value; setContent(newC); };
  const updateSubpoint = (cIdx, sIdx, pIdx, spIdx, value) => { const newC = [...content]; newC[cIdx].terms.subtitles[sIdx].points[pIdx].subpoints[spIdx] = value; setContent(newC); };

  const removeSubtitle = (cIdx, sIdx) => { const newC = [...content]; newC[cIdx].terms.subtitles.splice(sIdx, 1); setContent(newC); };
  const removePoint = (cIdx, sIdx, pIdx) => { const newC = [...content]; newC[cIdx].terms.subtitles[sIdx].points.splice(pIdx, 1); setContent(newC); };
  const removeSubpoint = (cIdx, sIdx, pIdx, spIdx) => { const newC = [...content]; newC[cIdx].terms.subtitles[sIdx].points[pIdx].subpoints.splice(spIdx, 1); setContent(newC); };

  // Team Handlers
  const addTeamMember = (cIdx, tIdx) => { const newC = [...content]; newC[cIdx].team[tIdx].members.push({ name: "", role: "", description: "", image: "", file: null }); setContent(newC); };
  const updateTeamMember = (cIdx, tIdx, mIdx, key, value) => { const newC = [...content]; newC[cIdx].team[tIdx].members[mIdx][key] = value; setContent(newC); };
  const removeTeamMember = (cIdx, tIdx, mIdx) => { const newC = [...content]; newC[cIdx].team[tIdx].members.splice(mIdx, 1); setContent(newC); };
  const removeTeamBlock = (cIdx, tIdx) => { const newC = [...content]; newC[cIdx].team.splice(tIdx, 1); if (newC[cIdx].team.length === 0) delete newC[cIdx].team; setContent(newC); };

  // Contact Form Handlers
  // Add a new input field
  const addFormInput = () => setContactForm({
    ...contactForm,
    fields: [...contactForm.fields, { type: "text", name: "", placeholder: "" }]
  });

  // Update a specific field
  const updateFormInput = (idx, key, value) => {
    const newFields = [...contactForm.fields];
    newFields[idx][key] = value;
    setContactForm({ ...contactForm, fields: newFields });
  };

  // Remove a field
  const removeFormInput = (idx) => {
    const newFields = [...contactForm.fields];
    newFields.splice(idx, 1);
    setContactForm({ ...contactForm, fields: newFields });
  };

  // Update heading
  const updateFormHeading = (value) => setContactForm({ ...contactForm, heading: value });

  // Update button text
  const updateButtonText = (value) => setContactForm({ ...contactForm, button: { ...contactForm.button, text: value } });




  // FAQ Handlers
  const addFAQ = () => setFaq({ ...faq, faqsList: [...faq.faqsList, { question: "", answer: "" }] });
  const updateFAQ = (idx, key, value) => { const newF = [...faq.faqsList]; newF[idx][key] = value; setFaq({ ...faq, faqsList: newF }); };
  const removeFAQ = (idx) => { const newF = [...faq.faqsList]; newF.splice(idx, 1); setFaq({ ...faq, faqsList: newF }); };


  // ===== Submit Handler =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("page", pageTitle);
      formData.append("breadcrumb", JSON.stringify({ home: "Home", current: breadcrumb }));
      formData.append("hero", JSON.stringify({ heading: hero.heading, button: hero.button, image: hero.image }));
      if (hero.file) formData.append("heroImage", hero.file);

      formData.append("images", JSON.stringify({ title: imagesHeading, cards: images.map(img => ({ title: img.title, image: img.url })) }));
      images.forEach(img => img.file && formData.append("imageCards", img.file));

      formData.append("content", JSON.stringify(content));
      content.forEach(section => section.team?.forEach(tm => tm.members?.forEach(m => m.file && formData.append("teamMembers", m.file))));

      // ✅ Updated Contact Form
      formData.append("contactForm", JSON.stringify(contactForm));

      formData.append("faqs", JSON.stringify(faq));

      const url = changeBtn
        ? `${API}/api/admin/dynamic/update/${editingPageId}`
        : `${API}/api/admin/dynamic/create`;
      const method = changeBtn ? "put" : "post";

      const res = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      Swal.fire("Success", res.data.message || "Page saved", "success");

      // Reset all
      setPageTitle("");
      setBreadcrumb("");
      setHero({ heading: "", button: { text: "", link: "" }, image: "", file: null });
      setImages([]);
      setImagesHeading("");
      setContent([]);
      setContactForm({ heading: "", fields: [], button: { text: "Submit" } });
      setFaq({ heading: "", faqsList: [] });
      setChangeBtn(false);
      setEditingPageId(null);
      setRefreshPages(prev => prev + 1);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || err.message || "Something went wrong!", "error");
    }
  };

  // ===== Edit Page Function =====
  const editPage = async (id) => {
    try {
      const res = await axios.get(`${API}/api/admin/dynamic/${id}`, { withCredentials: true });
      const data = res.data.data;
      console.log("edit", data);

      setPageTitle(data.page || "");
      setBreadcrumb(data.breadcrumb?.current || "");
      setHero({
        heading: data.hero?.heading || "",
        button: data.hero?.button || { text: "", link: "" },
        image: data.hero?.image || "",
        file: null
      });
      setImages((data.images?.cards || []).map(img => ({ title: img.title, url: img.image, file: null })));
      setImagesHeading(data.images?.title || "");
      setContent(data.content || []);

      // ✅ Updated contactForm state
      setContactForm({
        heading: data.contactForm?.heading || "",
        fields: data.contactForm?.fields || [],
        button: data.contactForm?.button || { text: "Submit" }
      });

      setFaq({ heading: data.faqs?.heading || "", faqsList: data.faqs?.faqsList || [] });
      setEditingPageId(id);
      setChangeBtn(true);
      setMenuOpen(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Failed to fetch page data", "error");
    }
  };



  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} editPage={editPage} menuRef={menuRef} refresh={refreshPages} />

      <div className="flex-1 overflow-auto p-6">
        <button
          className="mb-4 p-2 fixed rounded-md bg-purple-600 text-white shadow hover:bg-purple-700 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <GiHamburgerMenu size={28} />
        </button>

        <h1 className="text-4xl font-extrabold text-center mb-8 text-purple-800">Page Editor</h1>

        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8 flex flex-col bg-white p-6 rounded-xl shadow-md">

          {/* Page Title & Breadcrumb */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder="Page Route / Name"
              value={pageTitle}
              onChange={e => setPageTitle(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none flex-1"
            />
            <input
              type="text"
              placeholder="Breadcrumb (Home > Page)"
              value={breadcrumb}
              onChange={e => setBreadcrumb(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none flex-1"
            />
          </div>




          {/* Hero Section */}
          <div className="border border-gray-200 p-6 rounded-xl bg-gray-50 space-y-4 shadow-sm">
            <h2 className="font-semibold text-xl text-purple-700">Hero Section</h2>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Heading" value={hero.heading} onChange={e => setHero({ ...hero, heading: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none" />
              <input type="text" placeholder="Button Text" value={hero.button.text} onChange={e => setHero({ ...hero, button: { ...hero.button, text: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none" />
              <input type="text" placeholder="Button Link" value={hero.button.link} onChange={e => setHero({ ...hero, button: { ...hero.button, link: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none" />
              <input type="text" placeholder="Image URL" value={hero.image || ""} onChange={e => setHero({ ...hero, image: e.target.value, file: null })} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none" />
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setHero({ ...hero, image: ev.target.result, file });
                  reader.readAsDataURL(file);
                }
              }} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none" />
              {hero.image && <img src={hero.image} alt="Hero" className="w-full mt-2 rounded-lg border border-gray-200 shadow-sm" />}
            </div>
          </div>

          {/* Image Cards Section */}
          <div className="border border-gray-200 p-6 rounded-xl bg-gray-50 space-y-4 shadow-sm">
            <h2 className="font-semibold text-xl text-purple-700">Image Cards</h2>
            <input type="text" placeholder="Section Heading" value={imagesHeading} onChange={e => setImagesHeading(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-300 focus:outline-none" />
            <div className="flex flex-wrap gap-4 mt-4">
              {images.map((img, i) => (
                <div key={i} className="border border-gray-300 p-3 rounded-lg relative w-44 bg-white shadow-sm">
                  <button type="button" onClick={() => { const newImgs = [...images]; newImgs.splice(i, 1); setImages(newImgs); }} className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1 rounded hover:bg-red-600">X</button>
                  <input type="text" placeholder="Title" value={img.title} onChange={e => { const newImgs = [...images]; newImgs[i].title = e.target.value; setImages(newImgs); }} className="border border-gray-300 rounded-lg px-2 py-1 w-full mb-2 focus:ring-2 focus:ring-purple-200 focus:outline-none" />
                  <input type="text" placeholder="Image URL" value={img.url || ""} onChange={e => { const newImgs = [...images]; newImgs[i].url = e.target.value; newImgs[i].file = null; setImages(newImgs); }} className="border border-gray-300 rounded-lg px-2 py-1 w-full mb-2 focus:ring-2 focus:ring-purple-200 focus:outline-none" />
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => { const newImgs = [...images]; newImgs[i].url = ev.target.result; newImgs[i].file = file; setImages(newImgs); };
                      reader.readAsDataURL(file);
                    }
                  }} className="border border-gray-300 rounded-lg px-2 py-1 w-full mb-2 focus:ring-2 focus:ring-purple-200 focus:outline-none" />
                  {img.url && <img src={img.url} className="w-full h-32 mt-2 object-cover rounded-lg border border-gray-200 shadow-sm" />}
                </div>
              ))}
              <button type="button" onClick={() => setImages([...images, { title: "", url: "", file: null }])} className="px-3 py-1 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition">Add Image</button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="border border-gray-200 p-6 rounded-xl bg-gray-50 space-y-4 shadow-sm">
            <h2 className="font-semibold text-xl text-purple-700">Content Sections</h2>
            <div className="flex gap-2 mb-4">
              <button type="button" onClick={addTermsSection} className="px-3 py-1 bg-purple-400 rounded-lg text-white hover:bg-purple-500 transition">Add Terms</button>
              <button type="button" onClick={addTeamSection} className="px-3 py-1 bg-green-400 rounded-lg text-white hover:bg-green-500 transition">Add Team</button>
            </div>
            {content.map((section, cIdx) => (
              <div key={cIdx} className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm space-y-4">

                {/* Terms Section */}
                {section.terms && section.terms.title !== undefined && (
                  <div className="border border-gray-200 p-3 rounded-lg relative bg-gray-50 space-y-3">
                    <button type="button" onClick={() => removeTermsSection(cIdx)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Remove Terms</button>
                    <input type="text" placeholder="Terms Title" value={section.terms.title} onChange={e => updateTermsTitle(cIdx, e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-300 focus:outline-none" />

                    {section.terms.subtitles?.map((sub, sIdx) => (
                      <div key={sIdx} className="border border-gray-300 p-2 rounded-lg relative bg-white space-y-2">
                        <button type="button" onClick={() => removeSubtitle(cIdx, sIdx)} className="absolute top-2 right-2 bg-red-500 text-white px-1 rounded text-xs hover:bg-red-600">X</button>
                        <input type="text" placeholder="Subtitle" value={sub.subtitle} onChange={e => updateSubtitle(cIdx, sIdx, e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-1" />

                        {sub.points.map((pt, pIdx) => (
                          <div key={pIdx} className="border border-gray-200 p-2 rounded-lg relative pl-2 space-y-2">
                            <button type="button" onClick={() => removePoint(cIdx, sIdx, pIdx)} className="absolute top-2 right-2 bg-red-500 text-white px-1 rounded text-xs hover:bg-red-600">X</button>
                            <input type="text" placeholder="Point" value={pt.text} onChange={e => updatePoint(cIdx, sIdx, pIdx, e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-1" />

                            {pt.subpoints.map((sp, spIdx) => (
                              <div key={spIdx} className="pl-2 relative">
                                <button type="button" onClick={() => removeSubpoint(cIdx, sIdx, pIdx, spIdx)} className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded text-xs hover:bg-red-600">X</button>
                                <input type="text" placeholder="Subpoint" value={sp} onChange={e => updateSubpoint(cIdx, sIdx, pIdx, spIdx, e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 w-full mb-1 focus:ring-2 focus:ring-purple-200 focus:outline-none" />
                              </div>
                            ))}
                            <button type="button" onClick={() => addSubpoint(cIdx, sIdx, pIdx)} className="px-2 py-1 bg-yellow-400 rounded text-xs mt-1 hover:bg-yellow-500 transition">Add Subpoint</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addPoint(cIdx, sIdx)} className="px-2 py-1 bg-yellow-400 rounded text-xs mt-1 hover:bg-yellow-500 transition">Add Point</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addSubtitle(cIdx)} className="px-3 py-1 bg-blue-400 rounded text-white hover:bg-blue-500 transition">Add Subtitle</button>
                  </div>
                )}

                {/* Team Section */}
                {section.team?.length > 0 && section.team.map((teamBlock, tIdx) => (
                  <div key={tIdx} className="border border-gray-200 p-3 rounded-lg relative bg-gray-50 space-y-3">
                    <button type="button" onClick={() => removeTeamBlock(cIdx, tIdx)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Remove Team Block</button>
                    <input type="text" placeholder="Team Title" value={teamBlock.title} onChange={e => { const newContent = [...content]; newContent[cIdx].team[tIdx].title = e.target.value; setContent(newContent); }} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-300 focus:outline-none mb-2" />

                    {teamBlock.members.map((m, mIdx) => (
                      <div key={mIdx} className="border border-gray-300 p-2 rounded-lg relative space-y-2 bg-white">
                        <button type="button" onClick={() => removeTeamMember(cIdx, tIdx, mIdx)} className="absolute top-2 right-2 bg-red-500 text-white px-1 rounded text-xs hover:bg-red-600">X</button>
                        <input type="text" placeholder="Member Name" value={m.name} onChange={e => updateTeamMember(cIdx, tIdx, mIdx, "name", e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-1" />
                        <input type="text" placeholder="Role" value={m.role} onChange={e => updateTeamMember(cIdx, tIdx, mIdx, "role", e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-1" />
                        <textarea placeholder="Description" value={m.description} onChange={e => updateTeamMember(cIdx, tIdx, mIdx, "description", e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-1" />
                        <input type="text" placeholder="Image URL" value={m.image || ""} onChange={e => updateTeamMember(cIdx, tIdx, mIdx, "image", e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-1" />
                        <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) updateTeamMember(cIdx, tIdx, mIdx, "file", file); }} className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none" />
                      </div>
                    ))}
                    <button type="button" onClick={() => addTeamMember(cIdx, tIdx)} className="px-3 py-1 bg-blue-400 rounded text-white mt-2 hover:bg-blue-500 transition">Add Member</button>
                  </div>
                ))}
              </div>
            ))}
          </div>


          {/* Contact Form */}
          <div className="border border-gray-200 p-6 rounded-xl bg-gray-50 space-y-3 shadow-sm">
            <h2 className="font-semibold text-xl text-purple-700">Contact Form</h2>

            {/* Heading */}
            <input
              type="text"
              placeholder="Form Heading"
              value={contactForm.heading}
              onChange={e => updateFormHeading(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-2"
            />

            {/* Fields */}
            {contactForm.fields.map((field, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:gap-2 gap-2 items-center mb-2">
                <input type="text" placeholder="Field Type" value={field.type} onChange={e => updateFormInput(idx, "type", e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none" />
                <input type="text" placeholder="Name" value={field.name} onChange={e => updateFormInput(idx, "name", e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none" />
                <input type="text" placeholder="Placeholder" value={field.placeholder} onChange={e => updateFormInput(idx, "placeholder", e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none" />
                <button type="button" onClick={() => removeFormInput(idx)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition mt-2 md:mt-0">X</button>
              </div>
            ))}

            <button type="button" onClick={addFormInput} className="px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition">Add Input</button>

            {/* Button Text */}
            <input
              type="text"
              placeholder="Submit Button Text"
              value={contactForm.button.text}
              onChange={e => updateButtonText(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mt-2"
            />
          </div>


          {/* FAQ Section */}
          <div className="border border-gray-200 p-6 rounded-xl bg-gray-50 space-y-3 shadow-sm">
            <h2 className="font-semibold text-xl text-purple-700">FAQs</h2>
            <input type="text" placeholder="Heading" value={faq.heading} onChange={e => setFaq({ ...faq, heading: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-300 focus:outline-none mb-2" />
            {faq.faqsList.map((f, idx) => (
              <div key={idx} className="border border-gray-300 p-3 rounded-lg relative bg-white space-y-2">
                <button type="button" onClick={() => removeFAQ(idx)} className="absolute top-2 right-2 bg-red-500 text-white px-1 rounded text-xs hover:bg-red-600">X</button>
                <input type="text" placeholder="Question" value={f.question} onChange={e => updateFAQ(idx, "question", e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-1" />
                <textarea placeholder="Answer" value={f.answer} onChange={e => updateFAQ(idx, "answer", e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-200 focus:outline-none mb-1" />
              </div>
            ))}
            <button type="button" onClick={addFAQ} className="px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition">Add FAQ</button>
          </div>

          <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-semibold">{changeBtn ? "Update Page" : "Save Page"}</button>
        </form>
      </div>
    </div>

  );
};

export default PageEditor;
