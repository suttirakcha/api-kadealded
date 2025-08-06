import { createNewOrder } from "../services/payment.service.js";

export const createPayment = async (req, res, next) => {
  try {
    const url = await createNewOrder(req.body, req.user.id);
    res.json(url);
  } catch (error) {
    next(error)
  }
};
