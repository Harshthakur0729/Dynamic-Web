import express from "express";
import { createStyle, updateStyle, deleteStyle, getDataStyle } from "../controller/webStyle.controller.js";
import { IsAuth } from "../utils/IsAuth.js";

const router = express.Router();

// Routes
router.get("/style/getData", IsAuth, getDataStyle);
router.post("/style/create", IsAuth, createStyle);
router.put("/style/update", IsAuth, updateStyle);
router.delete("/style/delete", IsAuth, deleteStyle);

export default router;
