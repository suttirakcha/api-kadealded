import prisma from "../config/prisma.js";

export const createDeal = async (data) => {
  const result = await prisma.deal.create({ data });
  return result;
};

export const updateDeal = async (id, data) => {
  const result = await prisma.deal.update({
    where: { id },
    data,
  });
  return result;
};

export const deleteDeal = async (id) => {
  const result = await prisma.deal.delete({
    where: { id },
  });
  return result;
};

export const getAllDealJoiner = async (dealId) => {
  const result = await prisma.joinDeal.findMany({
    where: { deal_id: dealId },
    include: {
      user: true,
    },
  });
  return result;
};

export const getAllConfirmations = async () => {
  const result = await prisma.joinDeal.findMany({
    where: {
      confirm_at: {
        not: null,
      },
    },
    include: {
      user: true,
      deal: true,
      payments: true,
    },
  });
  return result;
};

export const approveRefundRequest = async (joinId) => {
  const result = await prisma.joinDeal.update({
    where: { id: joinId },
    data: {
      confirm_at: new Date(),
    },
  });
  return result;
};

export const rejectRefundRequest = async (joinId) => {
  const result = await prisma.joinDeal.update({
    where: { id: joinId },
    data: {
      confirm_at: null,
    },
  });
  return result;
};

export const getAllStatistics = async () => {
  const totalDeals = await prisma.deal.count();
  const totalUsers = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });
  const totalJoins = await prisma.joinDeal.count();
  const totalConfirmed = await prisma.joinDeal.count({
    where: { confirm_at: { not: null } },
  });
  const totalCoins = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  const topDeals = await prisma.joinDeal.groupBy({
    by: ["deal_id"],
    _count: { deal_id: true },
    orderBy: { _count: { deal_id: "desc" } },
  });
  return {
    totalDeals,
    totalUsers,
    totalJoins,
    totalConfirmed,
    totalCoinsUsed: totalCoins._sum.amount || 0,
    topDeals,
  };
};
