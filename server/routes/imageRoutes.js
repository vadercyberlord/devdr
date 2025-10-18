import { Router } from "express";
const router = Router()
import { upload } from "../middleware/multer.js";
import { getSingleImage, totalImages, updateImage, uploadImage } from "../controllers/imageController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

router.post('/upload-image',verifyJWT,upload.single('image'),uploadImage)
router.patch('/update-image/:id',verifyJWT,upload.single('image'),updateImage)
router.get('/singleImage/:id',getSingleImage)
router.get('/stats/:id',verifyJWT, totalImages)
export default router