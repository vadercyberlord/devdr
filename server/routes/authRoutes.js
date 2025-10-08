import {Router} from 'express'
import { loginUser, logoutUser, registerUser } from "../controllers/authController.js"
import { verifyJWT } from '../middleware/authMiddleware.js';
const authRouters = Router();

//rout: /api/auth/register
authRouters.post('/register',registerUser);
authRouters.post('/login', loginUser)
authRouters.post('/logout',verifyJWT, logoutUser)


export default authRouters;