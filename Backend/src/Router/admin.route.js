import express from "express";
import { adminLogin, adminLogout, adminRegister, adminupdate, forgotPassword, getData, resetPassword } from "../controller/admin.controller.js";
import { IsAuth } from "../utils/IsAuth.js";
import { upload } from "../utils/multer.js";
const router = express.Router();
router.route("/register").post(adminRegister);
router.route("/update/:id").put(upload.single("profileImage"), IsAuth, adminupdate)
router.route("/login").post(adminLogin);
router.route("/logout").post(IsAuth, adminLogout);
router.route("/data").get(IsAuth, getData)
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
export default router;