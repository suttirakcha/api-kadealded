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

adminRouter.use(authUserCheck);
adminRouter.use(checkRole(["ADMIN", "SUPERADMIN"]));

adminRouter.post("/deals", uploadMiddleware.array("image", 5), createDeal);
adminRouter.put("/deal/:id", uploadMiddleware.array("image", 5), updateDeal);
adminRouter.delete(
  "/deal/:id",
  checkRole(["SUPERADMIN"]),
  uploadMiddleware.array("image", 5),
  deleteDeal
);
adminRouter.get("/deals/:id/joiners", getAllDealJoiner);
adminRouter.get("/confirmations", getAllConfirmations);
adminRouter.post("/confirmations/:joinId/approve", approveRefundRequest);
adminRouter.post("/confirmations/:joinId/reject", rejectRefundRequest);
adminRouter.get("/stats", getAllStats);
adminRouter.get("/stats/deals-total", countTotalDeals);
adminRouter.get("/stats/customers-total", countTotalCustomers);
adminRouter.get("/stats/joins-total", countTotalConfirmed);
adminRouter.get("/stats/confirmed-total", countTotalJoinDeals);
adminRouter.get("/stats/conis-used", sumTotalCoins);
adminRouter.get("/stats/top-deals", getTopDeals);
adminRouter.get("/stats/almost-expired", getAlmostExpiredDeals);
adminRouter.get("/stats/cancelled", getCancelledDeals);
adminRouter.get("/stats/expired", getExpiredDeals);
adminRouter.get("/stats/new-customers-week", getNewCustomersThisWeek);
adminRouter.get("/stats/pending-payments", getPendingPayments);

export default adminRouter;
