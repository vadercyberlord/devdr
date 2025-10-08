import { Router } from "express";
const router = Router()
import { upload } from "../middleware/multer.js";
import { uploadImage } from "../controllers/imageController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

router.post('/upload-image',verifyJWT,upload.single('image'),uploadImage)

export default router