import express from "express";
import {
  approveRefundRequest,
  countTotalConfirmed,
  countTotalCustomers,
  countTotalDeals,
  countTotalJoinDeals,
  createDeal,
  deleteDeal,
  getAllConfirmations,
  getAllDealJoiner,
  getAllStats,
  getAlmostExpiredDeals,
  getCancelledDeals,
  getExpiredDeals,
  getNewCustomersThisWeek,
  getPendingPayments,
  getTopDeals,
  rejectRefundRequest,
  sumTotalCoins,
  updateDeal,
} from "../controllers/admin.controller.js";
import { authUserCheck } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/deals",authUserCheck,checkRole(["ADMIN", "SUPERADMIN"]),uploadMiddleware.array('image',5),createDeal);
adminRouter.put("/deal/:id",authUserCheck,checkRole(["ADMIN", "SUPERADMIN"]),uploadMiddleware.array('image',5),updateDeal);
adminRouter.delete("/deal/:id",authUserCheck,checkRole(["SUPERADMIN"]),uploadMiddleware.array('image',5),deleteDeal);
adminRouter.get("/deals/:id/joiners",authUserCheck,checkRole(["ADMIN", "SUPERADMIN"]), getAllDealJoiner);
adminRouter.get("/confirmations",authUserCheck,checkRole(["ADMIN", "SUPERADMIN"]),getAllConfirmations);
adminRouter.post("/confirmations/:joinId/approve",authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]),approveRefundRequest);
adminRouter.post("/confirmations/:joinId/reject",authUserCheck,checkRole(["ADMIN", "SUPERADMIN"]),rejectRefundRequest);
adminRouter.get("/stats",authUserCheck,checkRole(["ADMIN", "SUPERADMIN"]),getAllStats);
adminRouter.get("/stats/deals-total", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), countTotalDeals)
adminRouter.get("/stats/customers-total", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), countTotalCustomers)
adminRouter.get("/stats/joins-total", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), countTotalConfirmed)
adminRouter.get("/stats/confirmed-total", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), countTotalJoinDeals)
adminRouter.get("/stats/conis-used", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), sumTotalCoins)
adminRouter.get("/stats/top-deals", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), getTopDeals)
adminRouter.get("/stats/almost-expired", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), getAlmostExpiredDeals)
adminRouter.get("/stats/cancelled", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), getCancelledDeals)
adminRouter.get("/stats/expired", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), getExpiredDeals)
adminRouter.get("/stats/new-customers-week", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), getNewCustomersThisWeek)
adminRouter.get("/stats/pending-payments", authUserCheck, checkRole(["ADMIN", "SUPERADMIN"]), getPendingPayments)

export default adminRouter;
