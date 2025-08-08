import prisma from "../config/prisma.js";
import stripe from "../config/stripe.js";
import BadRequest from "../error/badrequest-error.js";
import InternalError from "../error/internal-error.js";
import NotFound from "../error/notfound-error.js";

export const createNewOrder = async (data,userId) => {
  const {amount ,priceId} = data 
  const { url, stripeSessionId } = await createStripeSeesion(
    parseInt(userId),
    priceId,
    amount
  );
  // await prisma.payment.create({
  //   stripeSessionId,
  //   amount, 
  //   userId,
  // });
  return { url };
};

export const createStripeSeesion = async (userId,paymentId,amount) => {
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "promptpay"],
      line_items: [{price : paymentId, quantity : 1}],
      metadata: { userId },
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });
    prisma.payment.create({
      data : {
        amount,
        userId,
        stripeSessionId : stripeSession.id,
      }
    })
    console.log(stripeSession)
    return {url : stripeSession.url } 
    
  } catch (error) {
    console.log(error)
    throw new InternalError(error.message);
  }
};
