import {
  findUser,
  getAllDeal,
  getCoinsUser,
  getDealById,
  getDealHistory,
  getProfile,
  reduceCoins,
  topUpCoins,
  updateUser,
} from "../services/user.service.js";
import { createErrorUtil } from "../utils/createError.util.js";
import prisma from "../config/prisma.js";
import crypto from "crypto";

export const controllerGetAll = async (req, res, next) => {
  try {
    const result = await getAllDeal();
    res.status(200).json({ message: "Deals found", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetDealById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getDealById(id);
    res.status(200).json({ message: "Deal found", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getProfile(id);
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerTopUpCoins = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const { id } = req.user;
    const result = await topUpCoins(id, amount);
    res.json({ message: "Coins added", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerReduceCoins = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const { id } = req.user;
    const result = await reduceCoins(id, amount);
    res.json({ message: "Coins used", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetCoinsUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await getCoinsUser(id);

    if (!result) {
      createErrorUtil(400, "Invalid user");
    }

    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const controllerGetDealHistory = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await getDealHistory(id);

    if (!result) {
      createErrorUtil(400, "Invalid user");
    }

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
export const controllerUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await updateUser(id, req.body);
    res.status(200).json({ message: "Profile updated", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  const { id } = req.user;
  const user = await findUser(id);

  res.status(200).json({ message: "User fetched", user })
}

export const controllerJoinDeal = async (req, res, next) => {
  console.log("Request received for controllerJoinDeal");
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const deal = await prisma.deal.findUnique({ where: { id: id } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!deal || !user) {
      return res.status(404).json({ message: "Deal or user not found" });
    }

    const dealPrice = 50; //set temporary
    if (user.coin < dealPrice) {
      return res.status(400).json({ message: "Not enough coin" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { coin: { decrement: dealPrice } },
    });

    const token = crypto.randomBytes(8).toString("hex").toUpperCase();
    const newQrCode = await prisma.qrCode.create({
      data: {
        token,
        userId,
        dealId: id,
      },
    });

    return res.status(200).json({ qrCode: { token: newQrCode.token } });
  } catch (error) {
    console.error("Error joining deal:", error);
    // return res.status(500).json({ message: "Internal server error" });
    next(error)
  }
};
