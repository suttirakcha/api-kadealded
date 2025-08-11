import express from 'express'
import { authUserCheck } from '../middlewares/auth.middleware.js'
import { createPayment } from '../controllers/payment.controller.js'

const paymentRouter = express.Router()

paymentRouter.post('/payment',authUserCheck, createPayment)

export default paymentRouter