import { Router } from "express";
import { createComment } from "../controllers/commentController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const route = Router()

route.post('/:imageId/createComment',verifyJWT,createComment)

export default route