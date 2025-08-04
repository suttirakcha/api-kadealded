import express from "express";
<<<<<<< Updated upstream
import {
  loginController,
  registerController,
} from "../controllers/auth.controller.js";
import {
  loginSchema,
  registerSchema,
  validate,
} from "../validators/validation.js";
=======
import { loginController, logoutController, registerController } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "../validators/validation.js";
>>>>>>> Stashed changes
import { loginWithGoogle } from "../controllers/google-auth.controller.js";
import { getAllDealJoiner } from "../controllers/admin.controller.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";

const authUserRouter = express.Router();
<<<<<<< Updated upstream
authUserRouter.post(
  "/register",
  uploadMiddleware.array("profile_image", 5),
  validate(registerSchema),
  registerController
);
authUserRouter.post("/login", validate(loginSchema), loginController);
authUserRouter.post("/auth/google", loginWithGoogle);
=======
authUserRouter.post('/register',validate(registerSchema),registerController)
authUserRouter.post('/login',validate(loginSchema),loginController);
authUserRouter.post('/logout',logoutController);
authUserRouter.post('/auth/google', loginWithGoogle);
>>>>>>> Stashed changes
authUserRouter.get("/deals/:id/joiners", getAllDealJoiner);

export default authUserRouter;
