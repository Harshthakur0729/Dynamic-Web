import jwt from "jsonwebtoken";
import adminModel from "../Schema/admin.js";
import config from "../config/config.js";
import redis from "./redis.server.js";

export const IsAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access, please login first" });
        }
        const isTokenBlackListed = await redis.get(`blacklist:${token}`);
        if (isTokenBlackListed) {
            return res.status(401).json({ error: "Token is blacklisted. Please login again." });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (!decoded || !decoded._id) {
            return res.status(401).json({ error: "Invalid token, please login again" });
        }
        let adminData = await redis.get(`admin:${decoded._id}`);
        let admin;
        if (adminData) {
            admin = JSON.parse(adminData);
        } else {
            admin = await adminModel.findById(decoded._id).select("-password");
            if (!admin) {
                return res.status(401).json({ error: "Admin not found, unauthorized" });
            }
            await redis.set(`admin:${decoded._id}`, JSON.stringify(admin), "EX", 3600);
        }
        req.admin = admin;
        req.tokenData = { token, ...decoded };
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};


 