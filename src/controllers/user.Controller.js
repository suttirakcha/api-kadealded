import {
  getAllDeal,
  getCoinsUser,
  getDealById,
  getDealHistory,
  getProfile,
  getQrCodeHistory,
  updateUser,
} from "../services/user.service.js";

export const controllerGetAll = async (req, res, next) => {
  try {
    const result = await getAllDeal();
    res.status(200).json({ message: "Deals found", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetAllDealById = async (req, res, next) => {
  try {
    const result = await getDealById(req.params.id);
    res.status(200).json({ message: "Deal found", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetProfile = async (req, res, next) => {
  try {
    const result = await getProfile(req.params.id);
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerTopUpCoins = async () => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetCoinsUser = async (req, res, next) => {
  try {
    const result = await getCoinsUser(req.params.id);
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetDealHistory = async (req, res, next) => {
  try {
    const result = await getDealHistory(req.params.id);
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetQrCodeHistory = async (req, res, next) => {
  try {
    const result = await getQrCodeHistory(req.params);
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerUpdateUser = async(req,res,next) => {
  try {
    const result = await updateUser(req.body)
    res.status(200).json({result})
  } catch (error) {
    console.log(error)
    next(error)
  }
}