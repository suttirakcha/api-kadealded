import express from "express";
import {
  adminUpdateUser,
  countTotalConfirmed,
  countTotalCustomers,
  countTotalDeals,
  countTotalJoinDeals,
  createCategory,
  createDeal,
  createSeller,
  deleteCategory,
  deleteDeal,
  deleteSeller,
  getAllCategories,
  getAllDeals,
  getAllSellers,
  getAllStats,
  getAllUsers,
  getAlmostExpiredDeals,
  getCancelledDeals,
  getExpiredDeals,
  getNewCustomersThisWeek,
  getPendingPayments,
  getTopDeals,
  sumTotalCoins,
  updateCategory,
  updateDeal,
  updateSeller,
} from "../controllers/admin.controller.js";
import { authUserCheck } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";

const adminRouter = express.Router();

adminRouter.use(authUserCheck);
adminRouter.use(checkRole(["ADMIN", "SUPERADMIN"]));

adminRouter.get("/users", getAllUsers)
adminRouter.put("/users/:id", checkRole(["ADMIN", "SUPERADMIN"]), adminUpdateUser)

adminRouter.get("/deals", getAllDeals)
adminRouter.post("/deals", uploadMiddleware.array("image", 5), createDeal);
adminRouter.put("/deals/:id", uploadMiddleware.array("image", 5), updateDeal);
adminRouter.delete("/deals/:id", checkRole(["SUPERADMIN"]), deleteDeal);

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

adminRouter.get("/categories", getAllCategories)
adminRouter.post("/categories", createCategory);
adminRouter.put("/categories/:id", updateCategory);
adminRouter.delete("/categories/:id", checkRole(["SUPERADMIN"]), deleteCategory);

adminRouter.get("/sellers", getAllSellers)
adminRouter.post("/sellers", createSeller)
adminRouter.put("/sellers/:id", updateSeller)
adminRouter.delete("/sellers/:id",checkRole(["SUPERADMIN"]), deleteSeller )

export default adminRouter;
