import Other from "../Schema/other.js";

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

// ✅ CREATE
export const takeOther = async (req, res) => {
    try {
        const { logo: logoRaw, text } = req.body;

        const logo = parseJSON(logoRaw, { header_logo: "", footer_logo: "" });

        // ✅ Header and Footer Logo upload
        if (req.files?.headerLogo?.[0]) logo.header_logo = req.files.headerLogo[0].path;
        if (req.files?.footerLogo?.[0]) logo.footer_logo = req.files.footerLogo[0].path;

        const newData = new Other({
            logo,
            text
        });

        await newData.save();

        return res.status(201).json({
            success: true,
            message: "Other page created successfully",
            data: newData
        });
    } catch (error) {
        console.error("takeOther Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

// ✅ UPDATE
export const updateTakeOther = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID is required" });

        const exist = await Other.findById(id);
        if (!exist) return res.status(404).json({ success: false, message: "Page does not exist" });

        // Parse values
        const logo = req.body.logo ? JSON.parse(req.body.logo) : exist.logo;
        const text = req.body.text ?? exist.text;
        const check = typeof req.body.check === "boolean" ? req.body.check : exist.check;

        // Header and Footer Logo update if file exists
        if (req.files?.headerLogo?.[0]) logo.header_logo = req.files.headerLogo[0].path;
        if (req.files?.footerLogo?.[0]) logo.footer_logo = req.files.footerLogo[0].path;

        // Update DB
        const updatedData = await Other.findByIdAndUpdate(
            id,
            { $set: { logo, text, check } },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Other page updated successfully",
            data: updatedData
        });
    } catch (error) {
        console.error("updateTakeOther Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


// Delete Other Page
export const deleteOther = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID is required" });

        const exist = await Other.findById(id);
        if (!exist) return res.status(404).json({ success: false, message: "Page does not exist" });

        await Other.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Other page deleted successfully",
            data: exist, // return the deleted record if needed
        });
    } catch (error) {
        console.error("DeleteOther Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


// GET all
export const getAllOther = async (req, res) => {
    try {
        const data = await Other.find();
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("Get All Other Error:", err);
        return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};

// GET by ID
export const getOtherById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Other.findById(id);
        if (!data) return res.status(404).json({ success: false, message: "Record not found" });
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("Get Other By ID Error:", err);
        return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};