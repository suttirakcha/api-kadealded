import express from "express";
import { loginController, logoutController, registerController } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "../validators/validation.js";
import { loginWithGoogle } from "../controllers/google-auth.controller.js";
import { getAllDealJoiner } from "../controllers/admin.controller.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";

const authUserRouter = express.Router();
authUserRouter.post(
  "/register",
  uploadMiddleware.array("profile_image", 5),
  validate(registerSchema),
  registerController
);
authUserRouter.post("/login", validate(loginSchema), loginController);
authUserRouter.post('/logout',logoutController);
authUserRouter.post("/auth/google", loginWithGoogle);
authUserRouter.get("/deals/:id/joiners", getAllDealJoiner);

export default authUserRouter;
