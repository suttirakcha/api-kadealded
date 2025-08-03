import express from "express";
import {
  controllerGetAll,
  controllerGetDealById,
  controllerGetCoinsUser,
  controllerGetDealHistory,
  controllerGetProfile,
  controllerGetQrCodeHistory,
  controllerUpdateUser,
} from "../controllers/user.Controller.js";
import { authUserCheck } from "../middlewares/auth.middleware.js";
import { refreshTokenController } from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.get("/deal", controllerGetAll);
userRouter.get("/deal/:id", controllerGetDealById);
userRouter.get("/auth/profile", authUserCheck, controllerGetProfile);
userRouter.post("/refresh", refreshTokenController);
userRouter.get("/auth/coins/history", authUserCheck, controllerGetCoinsUser);
userRouter.get('/auth/deal/history',authUserCheck,controllerGetDealHistory)
userRouter.get('/auth/deal/:id/qr',authUserCheck,controllerGetQrCodeHistory)
// userRouter.put('/auth/update/profile',refreshTokenController,controllerUpdateUser)
userRouter.put('/auth/update/profile',authUserCheck,controllerUpdateUser)

export default userRouter;
