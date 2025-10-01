import jwt from "jsonwebtoken";
import config from "../config/config.js";
import adminModel from "../Schema/admin.js";
import redis from "../utils/redis.server.js";
import nodemailer from "nodemailer";

// Admin Register
export const adminRegister = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) { return res.status(400).json({ message: "All fields are required." }); }
        const adminCount = await adminModel.countDocuments();
        if (adminCount >= 3) { return res.status(400).json({ message: "Maximum 3 admins allowed." }); }
        const existing = await adminModel.findOne({ username });
        if (existing) { return res.status(400).json({ message: "Admin already exists." }); }
        const hashingPassword = await adminModel.hashPassword(password)
        const admin = new adminModel({ username, email, password: hashingPassword });
        await admin.save();
        const adminData = admin.toObject();
        delete adminData.password;
        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: adminData,
        });
    } catch (error) {
        console.error("Register route error:", error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

// Admin Login 
export const adminLogin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: "All fields are required." });
        const admin = await adminModel.findOne({ username });
        if (!admin) return res.status(404).json({ message: "Admin does not exist." });
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid password." });
        const token = admin.generateToken();
        res.cookie("token", token, {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
            path: "/",
        });


        const adminData = admin.toObject();
        delete adminData.password;
        return res.status(200).json({
            success: true,
            message: "Login successful",
            admin: adminData,
            token,
        });
    } catch (error) {
        console.error("Login route error:", error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

// Admin Logout 
export const adminLogout = async (req, res) => {
    try {

        const { token, exp } = req.tokenData;
        const timeRemainingForToken = exp * 1000 - Date.now();
        const expiresInSeconds = Math.max(1, Math.floor(timeRemainingForToken / 1000));
        await redis.set(`blacklist:${token}`, true, "EX", expiresInSeconds);
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        return res.status(500).json({ error: "Server error during logout" });
    }
}

// ✅ Admin Data Get
export const getData = async (req, res) => {
    try {
        const { _id } = req.tokenData;
        console.log("req.tokenData", req.tokenData);
        if (!_id) return res.status(400).json({ message: "Please Login User." });
        const admin = await adminModel.findById(_id);

        if (!admin) return res.status(404).json({ message: "Admin does not exist" });

        res.status(200).json({
            success: true,
            message: "Admin data retrieved successfully",
            admin,
            token: req.tokenData.token,
        });
    } catch (error) {
        console.error("Admin Get Data error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ Admin Update Controller
export const adminupdate = async (req, res) => {
    try {
        const { _id } = req.tokenData;
        const { username, email, oldPassword, newPassword } = req.body;

        if (!_id) {
            return res.status(400).json({ success: false, message: "Please login first." });
        }

        if (!username || !email) {
            return res.status(400).json({ success: false, message: "Username and email are required." });
        }

        const admin = await adminModel.findById(_id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin does not exist." });
        }

        // Handle profile image update
        if (req.file) {
            admin.profileImage = req.file.path;
        }

        // Handle password change
        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({ success: false, message: "Old password required to change password" });
            }

            const isMatch = await admin.comparePassword(oldPassword);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Old password is incorrect" });
            }

            admin.password = await adminModel.hashPassword(newPassword);
        }

        // Update other fields
        admin.username = username;
        admin.email = email;

        const updatedAdmin = await admin.save();

        return res.status(200).json({
            success: true,
            message: "Admin updated successfully.",
            admin: updatedAdmin
        });
    } catch (error) {
        console.error("Admin Update Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};



// Admin Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({ message: "Username and Email are required." });
        }

        const admin = await adminModel.findOne({ username, email });
        if (!admin) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        admin.resetPasswordOTP = otp;
        admin.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 min
        await admin.save();

        // Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS, // App password if Gmail has 2FA
            },
        });

        await transporter.sendMail({
            from: config.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
        });

        // JWT token for password reset
        const token = jwt.sign({ username, email }, config.JWT_SECRET_reset_Password, { expiresIn: "10m" });

        res.cookie("passwordResetToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        res.status(200).json({ message: "OTP sent to your email", token });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};


// Admin Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { otp, newPassword, confirmpassword } = req.body;

        // Get token from cookie or header
        const token = req.cookies?.passwordResetToken || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized access, token missing" });

        // Check if token is blacklisted
        const isTokenBlackListed = await redis.get(`blacklist token admin password:${token}`);
        if (isTokenBlackListed) {
            return res.status(401).json({ error: "Token is blacklisted. Please login again." });
        }

        // Decode token
        const decoded = jwt.verify(token, config.JWT_SECRET_reset_Password);
        if (!decoded || !decoded.username) return res.status(401).json({ error: "Invalid token, please retry" });

        const { username } = decoded;

        // Fetch admin
        const admin = await adminModel.findOne({ username });
        if (!admin) return res.status(404).json({ message: "User not found" });

        // Validate OTP
        if (admin.resetPasswordOTP !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (Date.now() > admin.resetPasswordOTPExpire) return res.status(400).json({ message: "OTP expired" });
        if (newPassword !== confirmpassword) return res.status(400).json({ message: "Passwords do not match" });

        // Check if new password is same as old
        const isSamePassword = await admin.comparePassword(newPassword);
        if (isSamePassword) return res.status(400).json({ message: "New password cannot be same as old password" });

        // Hash and update password
        admin.password = await adminModel.hashPassword(newPassword);
        admin.resetPasswordOTP = undefined;
        admin.resetPasswordOTPExpire = undefined;
        await admin.save();

        // Blacklist token
        const decodedToken = jwt.decode(token);
        if (decodedToken?.exp) {
            const timeRemainingForToken = decodedToken.exp * 1000 - Date.now();
            const expiresInSeconds = Math.max(1, Math.floor(timeRemainingForToken / 1000));
            await redis.set(`blacklist token admin password:${token}`, true, "EX", expiresInSeconds);
        }

        // Clear password reset cookie
        res.clearCookie("passwordResetToken");

        // Send success response
        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

