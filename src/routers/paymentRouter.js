import express from 'express'
import { authUserCheck } from '../middlewares/auth.middleware'
import { createPayment } from '../controllers/payment.controller'

const paymentRouter = express.Router()

paymentRouter.post('/payment',authUserCheck,createPayment)

export default paymentRouter