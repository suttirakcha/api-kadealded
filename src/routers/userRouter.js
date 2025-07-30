import express from "express";
import {
  controllerGetAll,
  controllerGetAllDealById,
  controllerGetCoinsUser,
  controllerGetDealHistory,
  controllerGetProfile,
  controllerGetQrCodeHistory,
} from "../controllers/user.Controller.js";
import { authUserCheck } from "../middlewares/auth.middleware.js";
import { refreshTokenController } from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.get("/deal", controllerGetAll);
userRouter.get("/deal/:id", controllerGetAllDealById);
userRouter.get("/auth/profile", authUserCheck, controllerGetProfile);
userRouter.post("/refresh", refreshTokenController);
userRouter.get("/auth/coins/history", authUserCheck, controllerGetCoinsUser);
userRouter.get('/auth/deal/history',authUserCheck,controllerGetDealHistory)
userRouter.get('/auth/deal/:id/qr',authUserCheck,controllerGetQrCodeHistory)

export default userRouter;
