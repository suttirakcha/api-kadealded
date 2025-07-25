import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import { registerSchema, validate } from "../validators/validation.js";

const authUserRouter = express.Router();
authUserRouter.post('/register',validate(registerSchema),registerController)
authUserRouter.post('/login',loginController)


export default authUserRouter;
