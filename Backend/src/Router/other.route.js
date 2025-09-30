import express from "express";
const router = express.Router();
import { IsAuth } from "../utils/IsAuth.js";
import { deleteOther, getAllOther, getOtherById, takeOther, updateTakeOther } from "../controller/other.controller.js";
import { imagesUpload } from "../utils/multer.js";



// ✅ get data 
router.get("/other", getAllOther);

// ✅ CREATE Other Page
router.post(
    "/other/create",
    IsAuth,
    imagesUpload.fields([
        { name: "headerLogo", maxCount: 1 },
        { name: "footerLogo", maxCount: 1 },
    ]),
    takeOther
);

// ✅ UPDATE Other Page
router.put(
    "/other/update/:id",
    IsAuth,
    imagesUpload.fields([
        { name: "headerLogo", maxCount: 1 },
        { name: "footerLogo", maxCount: 1 },
    ]),
    updateTakeOther
);
// ✅ Delete 
router.delete("/other/delete/:id",IsAuth,deleteOther)


// If i need i will use it 
router.get("/other:id", IsAuth, getOtherById);

export default router;
