import { getAllDeal, getDealById } from "../services/user.service.js";

export const controllerGetAll = async (req, res, next) => {
  try {
    const result = await getAllDeal();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetAllDealById = async() => {
  try {
    const result = await getDealById(req.params)
    res.status(200).json({result})
  } catch (error) {
    console.log(error)
    next(error)
  }
}
