import prisma from "../config/prisma";
import stripe from "../config/stripe";
import BadRequest from "../error/badrequest-error";
import InternalError from "../error/internal-error";
import NotFound from "../error/notfound-error";

export const createNewOrder = async (data,userId) => {
  const {amount ,priceId} = data 
  const { url, stripeSessionId } = await createStripeSeesion(
    parseInt(userId),
    priceId
  );
  await prisma.payment.create({
    stripeSessionId,
    amount, 
    userId,
  });
  return { url };
};

export const createStripeSeesion = async (userId,paymentId) => {
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
    return {url : stripeSession.url , st} 
    
  } catch (error) {
    throw new InternalError(error.message);
  }
};
