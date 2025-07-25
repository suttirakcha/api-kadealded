import express from "express";
import {
  approveRefundRequest,
  createDeal,
  deleteDeal,
  getAllConfirmations,
  getAllDealJoiner,
  getAllStatistics,
  rejectRefundRequest,
  updateDeal,
} from "../controllers/admin.controller.js";
import { authUserCheck } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";

const adminRouter = express.Router();

adminRouter.post(
  "/deals",
  authUserCheck,
  checkRole(["ADMIN", "SUPERADMIN"]),uploadMiddleware.array('image',5),
  createDeal
);
adminRouter.put(
  "/deal/:id",
  authUserCheck,
  checkRole(["ADMIN", "SUPERADMIN"]),uploadMiddleware.array('image',5),
  updateDeal
);
adminRouter.delete(
  "/deal/:id",
  authUserCheck,
  checkRole(["SUPERADMIN"]),uploadMiddleware.array('image',5),
  deleteDeal
);
adminRouter.get(
  "/deals/:id/joiners",
  authUserCheck,
  checkRole(["ADMIN", "SUPERADMIN"]),
  getAllDealJoiner
);
adminRouter.get(
  "/confirmations",
  authUserCheck,
  checkRole(["ADMIN", "SUPERADMIN"]),
  getAllConfirmations
);
adminRouter.post(
  "/confirmations/:joinId/approve",
  authUserCheck,
  checkRole(["ADMIN", "SUPERADMIN"]),
  approveRefundRequest
);
adminRouter.post(
  "/confirmations/:joinId/reject",
  authUserCheck,
  checkRole(["ADMIN", "SUPERADMIN"]),
  rejectRefundRequest
);
adminRouter.get(
  "/statistics",
  authUserCheck,
  checkRole(["ADMIN", "SUPERADMIN"]),
  getAllStatistics
);

export default adminRouter;
