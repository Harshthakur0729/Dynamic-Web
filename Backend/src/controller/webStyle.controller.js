import WebsiteStyle from "../Schema/websiteStyleSchema.js";

// Get style data
export const getDataStyle = async (req, res) => {
    try {
        const styleData = await WebsiteStyle.findOne();
        if (!styleData) {
            return res.status(404).json({ success: false, message: "Style data not found" });
        }

        res.status(200).json({ success: true, data: styleData });
    } catch (error) {
        console.error("Error fetching style data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Create new style
export const createStyle = async (req, res) => {
    try {
        const existingStyle = await WebsiteStyle.findOne();
        if (existingStyle) {
            return res.status(400).json({ success: false, message: "Style data already exists, use update" });
        }

        const newStyleData = await WebsiteStyle.create(req.body);
        res.status(201).json({ success: true, message: "Style data created successfully", data: newStyleData });
    } catch (error) {
        console.error("Error creating style data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateStyle = async (req, res) => {
    try {
        let styleData = await WebsiteStyle.findOne();

        if (!styleData) {
            const newStyle = await WebsiteStyle.create(req.body);
            return res.status(201).json({ success: true, message: "Style created successfully", data: newStyle });
        }

        const updatedStyle = await WebsiteStyle.findByIdAndUpdate(styleData._id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, message: "Style data updated successfully", data: updatedStyle });
    } catch (error) {
        console.error("Error updating style data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Delete style
export const deleteStyle = async (req, res) => {
    try {
        const styleData = await WebsiteStyle.findOne();

        if (!styleData) {
            return res.status(200).json({ success: true, message: "No existing style, defaults applied" });
        }

        await WebsiteStyle.findByIdAndDelete(styleData._id);
        res.status(200).json({ success: true, message: "Style data deleted successfully" });
    } catch (error) {
        console.error("Error deleting style data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
