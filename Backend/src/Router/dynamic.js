import express from "express";
const router = express.Router();
import { IsAuth } from "../utils/IsAuth.js";
import { createDynamic, deleteDynamic, getData, updateDynamic, getSingleDynamic } from "../controller/dynamic.controller.js";
import { imagesUpload } from "../utils/multer.js";

//create
router.route("/dynamic/create").post(
    IsAuth,
    imagesUpload.fields([
        { name: "heroImage", maxCount: 1 },
        { name: "imageCards", maxCount: 20 },
        { name: "teamMembers", maxCount: 20 },
        { name: "headerLogo", maxCount: 1 },
        { name: "footerLogo", maxCount: 1 }
    ]),
    createDynamic
);
//update
router.put(
    "/dynamic/update/:id",
    IsAuth,
    imagesUpload.fields([
        { name: "heroImage", maxCount: 1 },
        { name: "imageCards", maxCount: 20 },
        { name: "teamMembers", maxCount: 20 },
        { name: "headerLogo", maxCount: 1 },
        { name: "footerLogo", maxCount: 1 }
    ]),
    updateDynamic
);
//delete0
router.route("/dynamic/:id").delete(IsAuth, deleteDynamic);
//get all data
router.route("/getData").get(getData);
// get single dynamic page
router.get("/dynamic/:id", IsAuth, getSingleDynamic);
export default router;