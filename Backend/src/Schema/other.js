import mongoose, { Schema } from "mongoose";


const othreSchema = new Schema({

    logo: {
        header_logo: { type: String },
        footer_logo: { type: String }
    },
    text: { type: String },
    check: { type: Boolean, default: false },
    info: {
        type: String,
        validate: {
            validator: function (value) {
                if (!value) return true; // empty allowed
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount <= 60;  // ✅ max 60 words allowed
            },
            message: "Info cannot exceed 60 words."
        }
    }


}, { timestamps: true })

const Other = mongoose.model("Other", othreSchema);
export default Other;