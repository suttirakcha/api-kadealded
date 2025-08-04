import prisma from "../config/prisma.js";
import { createErrorUtil } from "../utils/createError.util.js";

export const checkRole =
  (user_role, statusCode, errorMessage) => (req, res) => {
    const { role } = req.user;
    if (role !== user_role) {
      createErrorUtil(statusCode, errorMessage);
    }
  };

export const getAllDeal = async () => {
  const result = await prisma.deal.findMany({
    include: {
      category: true,
      seller: true,
      images: true,
    },
  });
  return result;
};

export const getDealById = async (id) => {
  const result = await prisma.deal.findFirst({
    where: {
      id,
    },
    include: {
      seller: true,
      category: true,
      images: true,
    },
  });
  return result;
};
export const getProfile = async (data) => {
  const { id } = data;
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};

export const topUpCoins = async (userId, amount) => {
  const totalTransactions = await prisma.coinTransaction.findMany({
    where: { user_id: userId },
  });

  if (!totalTransactions) {
    createErrorUtil(400, "No transactions");
  }

  const result = await prisma.coinTransaction.create({
    data: {
      user_id: userId,
      type: "TOPUP",
      amount,
    },
  });

  const currentCoins = totalTransactions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  await prisma.user.update({
    where: { id: userId },
    data: { coin: currentCoins },
  });

  return result;
};

export const getCoinsUser = async (data) => {
  const { id } = data;
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      CoinTransaction,
    },
  });
  return result;
};
export const getDealHistory = async (data) => {
  const { id } = data;
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      joinDeals: {
        include: {
          qrCode: true, // ดึงทั้งหมดมาก่อน
        },
      },
    },
  });

  // กรอง qrCode ที่ userId ตรงกับ req.user.id
  result.joinDeals = result.joinDeals.map((deal) => ({
    ...deal,
    qrCode: deal.qrCode.filter((qr) => qr.userId === req.user.id),
  }));
  return result;
};
export const createQrCodeDeal = async (data) => {
  const {} = data;
};

export const updateUser = async (id, data) => {
  // const { id } = data;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    createErrorUtil(400, "Not Found User");
  }
  const result = await prisma.user.update({
    where: { id: user.id },
    data,
  });
  return result;
};
