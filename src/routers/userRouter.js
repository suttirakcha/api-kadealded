import express from "express";
import { controllerGetAll, controllerGetAllDealById } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/deal",controllerGetAll);
userRouter.get("/deal/:id",controllerGetAllDealById);

export default userRouter;
