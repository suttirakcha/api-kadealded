import { PaymentStatus } from "@prisma/client";
import stripe from "../config/stripe.js";
import InternalError from "../error/internal-error.js";

export const handleStripeHook = async (signature, body) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);
    throw new InternalError(error.message);
  }
  console.log(`coming  event: ${event.type}`);
  const session = event.data.object;
  console.log("session", session);

  try {
    const paymentIntentId = session.payment_intent;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("paymentIntent", paymentIntent);

    const [paymentMethod] = paymentIntent.payment_method_types;
    const paymentData = {
      stripeIntentId: paymentIntentId,
      paymentMethod: paymentMethod.toUpperCase(),
      status: PaymentStatus.PAID
    };
  } catch (error) {
    console.log(error);
    throw new InternalError(error.message);
  }
};
