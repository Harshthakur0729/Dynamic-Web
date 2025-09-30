import Dynamic from "../Schema/dynamic.js";

// Helper to safely parse JSON
const parseJSON = (value, fallback = undefined) => {
    if (!value) return fallback;
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    }
    return value;
};

// ✅ CREATE PAGE
export const createDynamic = async (req, res) => {
    try {
        const {
            page,
            breadcrumb: breadcrumbRaw,
            hero: heroRaw,
            images: imagesRaw,
            content: contentRaw,
            contactForm: contactFormRaw,
            faqs: faqsRaw,
            menuPlacement: menuPlacementRaw
        } = req.body;

        if (!page) {
            return res.status(400).json({ success: false, message: "Page field is required" });
        }

        const exist = await Dynamic.findOne({ page });
        if (exist) {
            return res.status(400).json({ success: false, message: "Page already exists" });
        }

        const breadcrumb = parseJSON(breadcrumbRaw, { home: "Home", current: page });
        const hero = parseJSON(heroRaw, {});
        const images = parseJSON(imagesRaw, { cards: [] });
        const content = parseJSON(contentRaw, [{ terms: [], team: [] }]);
        const contactForm = parseJSON(contactFormRaw, { heading: "", fields: [], button: { text: "Submit" } });
        const faqs = parseJSON(faqsRaw, { heading: "", faqsList: [] });
        const menuPlacement = parseJSON(menuPlacementRaw, { header: false, dropdown: false, footer: false, top_pages: false });

        // ✅ Hero image
        if (req.files?.heroImage?.[0]) hero.image = req.files.heroImage[0].path;

        // ✅ Image cards
        if (req.files?.imageCards?.length) {
            images.cards = req.files.imageCards.map((file, i) => ({
                ...(images.cards[i] || {}),
                image: file.path,
            }));
        }

        // ✅ Team member images
        if (req.files?.teamMembers?.length) {
            content.forEach((section) => {
                section.team?.forEach((teamSection) => {
                    const allMembers = teamSection.members || [];
                    req.files.teamMembers.forEach((file, i) => {
                        if (allMembers[i]) allMembers[i].image = file.path;
                    });
                });
            });
        }

        const newData = new Dynamic({
            page,
            breadcrumb,
            hero,
            images,
            content,
            contactForm,
            faqs,
            menuPlacement
        });

        await newData.save();
        return res.status(201).json({
            success: true,
            message: "Page created successfully",
            data: newData
        });
    } catch (error) {
        console.error("CreateDynamic Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

// ✅ UPDATE PAGE
export const updateDynamic = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID is required" });

        const exist = await Dynamic.findById(id);
        if (!exist) return res.status(404).json({ success: false, message: "Page does not exist" });

        const breadcrumb = parseJSON(req.body.breadcrumb, exist.breadcrumb);
        const hero = parseJSON(req.body.hero, exist.hero);
        const images = parseJSON(req.body.images, exist.images);
        const content = parseJSON(req.body.content, exist.content);
        const contactForm = parseJSON(req.body.contactForm, exist.contactForm);
        const faqs = parseJSON(req.body.faqs, exist.faqs);
        const menuPlacement = parseJSON(req.body.menuPlacement, exist.menuPlacement);

        // ✅ Hero image
        if (req.files?.heroImage?.[0]) hero.image = req.files.heroImage[0].path;

        // ✅ Image cards
        if (req.files?.imageCards?.length) {
            images.cards = req.files.imageCards.map((file, i) => ({
                ...(images.cards[i] || {}),
                image: file.path,
            }));
        }

        // ✅ Team member images
        if (req.files?.teamMembers?.length) {
            content.forEach((section) => {
                section.team?.forEach((teamSection) => {
                    const allMembers = teamSection.members || [];
                    req.files.teamMembers.forEach((file, i) => {
                        if (allMembers[i]) allMembers[i].image = file.path;
                    });
                });
            });
        }

        const updatedData = await Dynamic.findByIdAndUpdate(
            id,
            {
                $set: {
                    breadcrumb,
                    hero,
                    images,
                    content,
                    contactForm,
                    faqs,
                    menuPlacement
                }
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Page updated successfully",
            data: updatedData
        });
    } catch (error) {
        console.error("UpdateDynamic Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// ✅ DELETE PAGE
export const deleteDynamic = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID is required" });

        const exist = await Dynamic.findById(id);
        if (!exist) return res.status(404).json({ success: false, message: "Page does not exist" });

        await Dynamic.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Page deleted successfully" });
    } catch (error) {
        console.error("DeleteDynamic Error:", error.message);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

// ✅ GET ALL PAGES
export const getData = async (req, res) => {
    try {
        const allData = await Dynamic.find({});
        return res.status(200).json({ success: true, data: allData });
    } catch (error) {
        console.error("GetDynamic Error:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

// ✅ GET SINGLE PAGE (fix: proper controller format)
export const getSingleDynamic = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await Dynamic.findById(id);
        if (!page) return res.status(404).json({ success: false, message: "Page not found" });
        return res.status(200).json({ success: true, data: page });
    } catch (error) {
        console.error("GetSingleDynamic Error:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
