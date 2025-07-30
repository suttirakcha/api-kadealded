import prisma from "../config/prisma.js";
import { createErrorUtil } from "../utils/createError.util.js";

export const createDeal = async (data) => {
  const { sellerName, creatorName, ...rest } = data;

  const seller = await prisma.seller.findFirst({
    where: { name: sellerName },
  });

  const creator = await prisma.user.findFirst({
    where: { name: creatorName },
  });
  if (!seller || !creator) {
    createErrorUtil("Seller or Creator Not Found");
  }

  const result = await prisma.deal.create({
    data: {
      ...rest,
      seller_id: seller.id,
      creator: creator.id,
    },
    include: {
      seller: true,
      createdByUser: true,
    },
  });
  return result;
};

export const updateDeal = async (id, data) => {
  const result = await prisma.deal.update({
    where: { id },
    data,
    include: {
      seller: true,
      createdByUser: true,
    }
  });
  return result;
};

export const deleteDeal = async (id, user) => {
  if (user.role !== "SUPERADMIN") {
    createErrorUtil("You Cannot Delete Deal");
  }
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
      deal: true
    },
  });
  return result;
};

// export const getAllConfirmations = async () => {
//   const result = await prisma.joinDeal.findMany({
//     where: {
//       confirm_at: {
//         not: null,
//       },
//     },
//     include: {
//       user: true,
//       deal: true,
//       payments: true,
//     },
//   });
//   return result;
// };

// export const approveRefundRequest = async (joinId) => {
//   const result = await prisma.joinDeal.update({
//     where: { id: joinId },
//     data: {
//       confirm_at: new Date(),
//     },
//   });
//   return result;
// };

// export const rejectRefundRequest = async (joinId) => {
//   const result = await prisma.joinDeal.update({
//     where: { id: joinId },
//     data: {
//       confirm_at: null,
//     },
//   });
//   return result;
// };

export const countTotalDeals = async () => {
  return await prisma.deal.count();
};

export const countTotalCustomers = async () => {
  return await prisma.user.count({
    where: { role: "CUSTOMER" },
  });
};

export const countTotalConfirmed = async () => {
  return await prisma.joinDeal.count({
    where: { confirm_at: { not: null } },
  });
};

export const countTotalJoinDeals = async () => {
  return await prisma.joinDeal.count();
};

export const sumTotalCoins = async () => {
  const result = await prisma.payment.aggregate({
    _sum: { amount: true },
  });
  return result._sum.amount || 0;
};

export const getTopDeals = async () => {
  return await prisma.joinDeal.groupBy({
    by: ["deal_id"],
    _count: { deal_id: true },
    orderBy: { _count: { deal_id: "desc" } },
  });
};

export const getAlmostExpiredDeals = async () => {
  return await prisma.deal.count({
    where: {
      deadline: {
        lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // expired in 2 days
        gte: new Date(),
      },
    },
  });
};

export const getCancelledDeals = async () => {
  return await prisma.deal.count({
    where: {
      deal_status: {
        in: ["CANCELLED"],
      },
    },
  });
};

export const getExpiredDeals = async () => {
  return await prisma.deal.count({
    where: {
      deal_status: {
        in: ["EXPIRED"],
      },
    },
  });
};

export const getNewCustomersThisWeek = async () => {
  return await prisma.user.count({
    where: {
      role: "CUSTOMER",
      created_at: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
      },
    },
  });
};

export const getPendingPayments = async () => {
  return await prisma.payment.count({
    where: {
      payment_status: "PENDING",
    },
  });
};

export const getAllStats = async () => {
  const totalDeals = await countTotalDeals();
  const totalCustomers = await countTotalCustomers();
  const totalJoinDeals = await countTotalJoinDeals();
  const totalConfirmed = await countTotalConfirmed();
  const totalCoinsUsed = await sumTotalCoins();
  const topDeals = await getTopDeals();
  const almostExpiredDeals = await getAlmostExpiredDeals();
  const cancelledDeals = await getCancelledDeals();
  const expiredDeals = await getExpiredDeals();
  const newCustomersThisWeek = await getNewCustomersThisWeek();
  const pendingPayments = await getPendingPayments();

  return {
    totalDeals,
    totalCustomers,
    totalJoinDeals,
    totalConfirmed,
    totalCoinsUsed,
    topDeals,
    almostExpiredDeals,
    cancelledDeals,
    expiredDeals,
    newCustomersThisWeek,
    pendingPayments,
  };
};
