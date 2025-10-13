import { Router } from "express";
const router = Router()
import { upload } from "../middleware/multer.js";
import { getSingleImage, updateImage, uploadImage } from "../controllers/imageController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

router.post('/upload-image',verifyJWT,upload.single('image'),uploadImage)
router.patch('/update-image/:id',verifyJWT,upload.single('image'),updateImage)
router.get('/singleImage/:id',getSingleImage)

export default router