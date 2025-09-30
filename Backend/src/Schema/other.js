import mongoose, { Schema } from "mongoose";


const othreSchema = new Schema({

    logo: {
        header_logo: { type: String },
        footer_logo: { type: String }
    },
    text: { type: String },
    check: { type: Boolean, default: false },
    

}, { timestamps: true })

const Other = mongoose.model("Other", othreSchema);
export default Other;