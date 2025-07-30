import prisma from "../config/prisma.js";

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

export const getDealById = async (data) => {
  const { id } = data;
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
export const topUpCoins = async () => {};

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
result.joinDeals = result.joinDeals.map(deal => ({
  ...deal,
  qrCode: deal.qrCode.filter(qr => qr.userId === req.user.id),
}));
  return result;
};
export const createQrCodeDeal = async (data) => {
  const {} = data;
};

export const getQrCodeHistory = async (data) => {
  const { id } = data;
  const result = await prisma.joinDeal.findUnique({
    where: {
      id,
    },

  });
 return result
};
