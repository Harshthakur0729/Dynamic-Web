import dotenv from "dotenv";
dotenv.config();

const _config = {
    PORT: process.env.PORT,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MONGODB_URL: process.env.MONGODB_URL,
    ORIGIN: process.env.ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    JWT_SECRET_reset_Password: process.env.JWT_SECRET_reset_Password
}

const config = Object.freeze(_config);
export default config;
