import express from "express";
import { controllerGetAll, controllerGetAllDealById, controllerGetProfile } from "../controllers/user.Controller.js";
import { authUserCheck } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/deal",controllerGetAll);
userRouter.get("/deal/:id",controllerGetAllDealById);
userRouter.get("/auth/profile",authUserCheck,controllerGetProfile)

export default userRouter;
