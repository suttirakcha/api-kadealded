import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "../validators/validation.js";
import { loginWithGoogle } from "../controllers/google-auth.controller.js";
import { getAllDealJoiner } from "../controllers/admin.controller.js";

const authUserRouter = express.Router();
authUserRouter.post('/register',validate(registerSchema),registerController)
authUserRouter.post('/login',validate(loginSchema),loginController);
authUserRouter.post('/auth/google', loginWithGoogle);
authUserRouter.get("/deals/:id/joiners", getAllDealJoiner);

export default authUserRouter;
