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
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) {
    createErrorUtil(404, "Deal Not Found");
  }
  const { seller_name, creator_name, category_name, images, ...rest } = data;

  const seller = seller_name
    ? await prisma.seller.findFirst({ where: { name: seller_name } })
    : null;

  const creator = creator_name
    ? await prisma.user.findFirst({ where: { name: creator_name } })
    : null;

  const category = category_name
    ? await prisma.category.findUnique({ where: { name: category_name } })
    : null;

  if (
    (seller_name && !seller) ||
    (creator_name && !creator) ||
    (category_name && !category)
  ) {
    createErrorUtil(400, "Seller, Creator, or Category Not Found");
  }

  const result = await prisma.deal.update({
    where: { id },
    data: {
      ...rest,
      seller_id: seller?.id || deal.seller_id,
      creator: creator?.id || deal.creator,
      category_id: category?.id || deal.category_id,
      ...(images?.create?.length > 0 && {
        images: {
          create: images.create,
        },
      }),
    },
    include: {
      seller: true,
      category: true,
      images: true,
      createdByUser: {
        select: {
          id: true,
          name: true,
          last_name: true,
          tel_number: true,
          email: true,
          role: true,
          birth_date: true,
          coin: true,
          trust_score_id: true,
          profile_image: true,
          created_at: true,
          updated_at: true,
        },
      },
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

export const createCategory = async (data) => {
  const existCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });
  if (existCategory) {
    createErrorUtil(400, "Category Name Already Exists");
  }

  return prisma.category.create({ data });
};

export const updateCategory = async (id, data) => {
  const existCategory = await prisma.category.findUnique({
    where: {
      name: data.name,
      NOT: { id },
    },
  });

  if (existCategory) {
    createErrorUtil(400, "Category Name Already Exists");
  }

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

export const createSeller = async (data) => {
  const existSeller = await prisma.seller.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existSeller) {
    createErrorUtil(400, "Seller's Email Already Exists");
  }

  return prisma.seller.create({ data });
};

export const updateSeller = async (id, data) => {
  const existSeller = await prisma.seller.findUnique({
    where: {
      email: data.email,
      NOT: { id },
    },
  });

  if (existSeller) {
    createErrorUtil(400, "Seller's Email Already Exists");
  }

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

export const getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      last_name: true,
      tel_number: true,
      email: true,
      role: true,
      birth_date: true,
      coin: true,
      trust_score_id: true,
      profile_image: true,
    },
  });
};

export const adminUpdateUser = async (id, data) => {
  const existUser = await prisma.user.findUnique({
    where: { id },
  });
  if (!existUser) {
    createErrorUtil(400, "User is not Found");
  }

  const { password, refresh_token, ...updateData } = data;

  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      last_name: true,
      tel_number: true,
      email: true,
      role: true,
      birth_date: true,
      coin: true,
      trust_score_id: true,
      profile_image: true,
      created_at: true,
      updated_at: true,
    },
  });
};
