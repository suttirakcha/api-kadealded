import prisma from "../config/prisma.js";
import { createErrorUtil } from "../utils/createError.util.js";

export const getAllDeals = async () => {
  return prisma.deal.findMany({
    include: {
      category: true,
      seller: true,
      _count: {
        select: {
          joindeals: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const createDeal = async (data) => {
  const { seller_name, creator_name, category_name, ...rest } = data;

  const seller = await prisma.seller.findFirst({
    where: { name: seller_name },
  });

  const creator = await prisma.user.findFirst({
    where: { name: creator_name },
  });

  const category = await prisma.category.findFirst({
    where: { name: category_name },
  });
  if (!seller || !creator || !category) {
    createErrorUtil(400, "Seller or Creator Not Found");
  }

  const result = await prisma.deal.create({
    data: {
      ...rest,
      seller_id: seller.id,
      creator: creator.id,
      category_id: category.id,
    },
    include: {
      seller: true,
      createdByUser: true,
      category: true,
    },
  });
  return result;
};

export const updateDeal = async (id, data) => {
  const { seller_name, creator_name, category_name, ...rest } = data;

  const seller = seller_name
    ? await prisma.seller.findFirst({ where: { name: seller_name } })
    : null;

  const creator = creator_name
    ? await prisma.user.findFirst({ where: { name: creator_name } })
    : null;

  const category = category_name
    ? await prisma.category.findFirst({ where: { name: category_name } })
    : null;

  if (
    (seller_name && !seller) ||
    (creator_name && !creator) ||
    (category_name && !category)
  ) {
    throw createErrorUtil(400, "Seller, Creator, or Category Not Found");
  }

  const result = await prisma.deal.update({
    where: { id },
    data: {
      ...rest,
      ...(seller && { seller_id: seller.id }),
      ...(creator && { creator: creator.id }),
      ...(category && { category_id: category.id }),
    },
    include: {
      seller: true,
      createdByUser: true,
      category: true,
    },
  });

  return result;
};

export const deleteDeal = async (id, user) => {
  if (user.role !== "SUPERADMIN") {
    createErrorUtil(400, "You Cannot Delete Deal");
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
      deal: true,
    },
  });
  return result;
};

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

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
};

export const createCategory = (data) => {
  return prisma.category.create({ data });
};

export const updateCategory = (id, data) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = (id) => {
  return prisma.category.delete({
    where: { id },
  });
};

export const getAllSellers = () => {
  return prisma.seller.findMany({
    orderBy: {
      name: "desc",
    },
  });
};

export const createSeller = (data) => {
  return prisma.seller.create({ data });
};

export const updateSeller = (id, data) => {
  return prisma.seller.update({
    where: { id },
    data,
  });
};

export const deleteSeller = (id) => {
  return prisma.seller.delete({
    where: { id },
  });
};
