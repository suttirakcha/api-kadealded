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
