import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import { registerSchema, validate } from "../validators/validation.js";

const userRouter = express.Router();
userRouter.post('/register',validate(registerSchema),registerController)
userRouter.post('/login',loginController)


export default userRouter;
