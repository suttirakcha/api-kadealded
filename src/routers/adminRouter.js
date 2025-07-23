import express from 'express'
import { approveRefundRequest, createDeal, deleteDeal, getAllConfirmations, getAllPromotionJoiner, getAllStatistics, rejectRefundRequest, updateDeal } from '../controllers/admin.controller.js'

const adminRouter = express.Router()

adminRouter.post("/deals", createDeal)
adminRouter.put("/deal/:id", updateDeal)
adminRouter.delete("/deal/:id", deleteDeal)
adminRouter.get("/deals/:id/joiners", getAllPromotionJoiner)
adminRouter.get("/confirmations", getAllConfirmations)
adminRouter.post("/confirmations/:joinId/approve", approveRefundRequest)
adminRouter.post("/confirmations/:joinId/reject", rejectRefundRequest)
adminRouter.get("/statistics", getAllStatistics)

export default adminRouter