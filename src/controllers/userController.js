import { getAllDeal, getDealById } from "../services/user.service.js";

export const controllerGetAll = async (req, res, next) => {
  try {
    const result = await getAllDeal();
    res.status(200).json({ message: "Deals found", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetAllDealById = async(req, res, next) => {
  try {
    const result = await getDealById(req.params.id)
    res.status(200).json({ message: "Deal found", result })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
