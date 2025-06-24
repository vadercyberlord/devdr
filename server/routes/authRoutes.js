import express from 'express'


import registerController from "../controllers/auth/userRegisterController.js"


const authRouters = express.Router();

//rout: /api/auth/register
authRouters.post('/register',registerController);


export default authRouters;