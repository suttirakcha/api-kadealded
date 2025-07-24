import { getAllDeal } from "../services/user.service";

export const getAll = async (req, res, next) => {
  try {
    const result = await getAllDeal();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
