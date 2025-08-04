import prisma from "../config/prisma.js";
import * as adminService from "../services/admin.service.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";

export const getAllDeals = async (req, res, next) => {
  try {
    const result = await adminService.getAllDeals();
    res.status(200).json({ deals: result });
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      max_participants: parseInt(req.body.max_participants, 10),
    };

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.path, "deals"))
      );
      imageUrls = uploads.map((upload) => upload.secure_url);
    }
    const result = await adminService.createDeal({
      ...data,
      images: {
        create: imageUrls.map((url) => ({ image_url: url })),
      },
    });
    res.status(201).json({ message: "Deal Created", result });
  } catch (error) {
    next(error);
  }
};

export const updateDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = {
      ...req.body,
      max_participants: parseInt(req.body.max_participants, 10),
    };

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.path, "deals"))
      );
      imageUrls = uploads.map((upload) => upload.secure_url);
    }
    const result = await adminService.updateDeal(id, {
      ...data,
      ...(imageUrls.length > 0 && {
        images: {
          create: imageUrls.map((url) => ({ image_url: url })),
        },
      }),
    });
    res.status(200).json({ message: "Deal Updated", result });
  } catch (error) {
    next(error);
  }
};

export const deleteDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const result = await adminService.deleteDeal(id, user);
    res.status(200).json({ message: "Deal Deleted", result });
  } catch (error) {
    next(error);
  }
};

export const getAllDealJoiner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await adminService.getAllDealJoiner(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const countTotalDeals = async (req, res, next) => {
  try {
    const result = await adminService.countTotalDeals();
    res.status(200).json({ TotalDeals: result });
  } catch (error) {
    next(error);
  }
};

export const countTotalCustomers = async (req, res, next) => {
  try {
    const result = await adminService.countTotalCustomers();
    res.status(200).json({ totalCustomers: result });
  } catch (error) {
    next(error);
  }
};

export const countTotalConfirmed = async (req, res, next) => {
  try {
    const result = await adminService.countTotalConfirmed();
    res.status(200).json({ TotalConfirmed: result });
  } catch (error) {
    next(error);
  }
};

export const countTotalJoinDeals = async (req, res, next) => {
  try {
    const result = await adminService.countTotalJoinDeals();
    res.status(200).json({ TotalJoinDeals: result });
  } catch (error) {
    next(error);
  }
};

export const sumTotalCoins = async (req, res, next) => {
  try {
    const result = await adminService.sumTotalCoins();
    res.status(200).json({ TotalCoins: result });
  } catch (error) {
    next(error);
  }
};

export const getTopDeals = async (req, res, next) => {
  try {
    const result = await adminService.getTopDeals();
    res.status(200).json({ TopDeals: result });
  } catch (error) {
    next(error);
  }
};

export const getAlmostExpiredDeals = async (req, res, next) => {
  try {
    const result = await adminService.getAlmostExpiredDeals();
    res.status(200).json({ AlmostExpiredDeals: result });
  } catch (error) {
    next(error);
  }
};
export const getCancelledDeals = async (req, res, next) => {
  try {
    const result = await adminService.getCancelledDeals();
    res.status(200).json({ CancelledDeals: result });
  } catch (error) {
    next(error);
  }
};
export const getExpiredDeals = async (req, res, next) => {
  try {
    const result = await adminService.getExpiredDeals();
    res.status(200).json({ ExpiredDeals: result });
  } catch (error) {
    next(error);
  }
};
export const getNewCustomersThisWeek = async (req, res, next) => {
  try {
    const result = await adminService.getNewCustomersThisWeek();
    res.status(200).json({ NewCustomersThisWeek: result });
  } catch (error) {
    next(error);
  }
};
export const getPendingPayments = async (req, res, next) => {
  try {
    const result = await adminService.getPendingPayments();
    res.status(200).json({ PendingPayment: result });
  } catch (error) {
    next(error);
  }
};

export const getAllStats = async (req, res, next) => {
  try {
    const result = await adminService.getAllStats();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const result = await adminService.getAllCategories();
    res.status(200).json({ categories: result });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await adminService.createCategory(data);
    res.status(201).json({ message: "Category Created", result });
  } catch (error) {
    next(error);
  }
};
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await adminService.updateCategory(id, data);
    res.status(201).json({ message: "Category Updated", result });
  } catch (error) {
    next(error);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteCategory(id);
    res.status(200).json({ message: "Category Deleted", result });
  } catch (error) {
    next(error);
  }
};

export const getAllSellers = async (req, res, next) => {
  try {
    const result = await adminService.getAllSellers();
    res.status(200).json({ sellers: result });
  } catch (error) {
    next(error);
  }
};

export const createSeller = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await adminService.createSeller(data);
    res.status(201).json({ message: "Seller Created", result });
  } catch (error) {
    next(error);
  }
};
export const updateSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await adminService.updateSeller(id, data);
    res.status(200).json({ message: "Seller Updated", result });
  } catch (error) {
    next(error);
  }
};
export const deleteSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteSeller(id);
    res.status(200).json({ message: "Seller Deleted", result });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers();
    res.status(200).json({ Users: result });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await adminService.adminUpdateUser(id, data);
    res.status(200).json({ message: "User Updated", result });
  } catch (error) {
    next(error);
  }
};
