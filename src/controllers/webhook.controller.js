import { handleStripeHook } from "../services/webhook.service.js"

export const handleStripeWebhook = async(req,res,next) => {
  try {
    const signature = req.headers["stripe-signature"]
    const {body} = req
    await handleStripeHook(signature , body)
  } catch (error) {
    console.log(error)
    next(error)
  }
}