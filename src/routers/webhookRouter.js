import express from 'express'
import { handleStripeWebhook } from '../controllers/webhook.controller.js'

const webhookRouter = express.Router()

webhookRouter.post("/",handleStripeWebhook)

export default webhookRouter