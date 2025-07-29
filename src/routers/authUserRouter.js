import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "../validators/validation.js";

const authUserRouter = express.Router();
authUserRouter.post('/register',validate(registerSchema),registerController)
authUserRouter.post('/login',validate(loginSchema),loginController)

export default authUserRouter;
