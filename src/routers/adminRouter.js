import express from 'express'
import { approveRefundRequest, createDeal, deleteDeal, getAllConfirmations, getAllDealJoiner, getAllStatistics, rejectRefundRequest, updateDeal } from '../controllers/admin.controller.js'
import { authUserCheck } from '../middlewares/auth.middleware.js'

const adminRouter = express.Router()

adminRouter.post("/deals", authUserCheck, createDeal)
adminRouter.put("/deal/:id", updateDeal)
adminRouter.delete("/deal/:id", deleteDeal)
adminRouter.get("/deals/:id/joiners", getAllDealJoiner)
adminRouter.get("/confirmations", getAllConfirmations)
adminRouter.post("/confirmations/:joinId/approve", approveRefundRequest)
adminRouter.post("/confirmations/:joinId/reject", rejectRefundRequest)
adminRouter.get("/statistics", getAllStatistics)

export default adminRouter