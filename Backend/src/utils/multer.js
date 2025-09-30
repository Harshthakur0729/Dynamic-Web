import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const dataStore = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "Dynamic images",
        format: file.mimetype.split("/")[1], // jpg, png, webp
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    }),
});

export const imagesUpload = multer({
    storage: dataStore,
    limits: {
        fileSize: 50 * 1024 * 1024,   // 50 MB per file
        fieldSize: 50 * 1024 * 1024,  // 50 MB per field
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    }
});


//Profile Image Upload
const profileStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "User_Profile",
        format: file.mimetype.split("/")[1], // jpg, png, webp
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    }),
});

export const upload = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only .jpeg, .png, .webp files allowed!"), false);
        }
        cb(null, true);
    },
});