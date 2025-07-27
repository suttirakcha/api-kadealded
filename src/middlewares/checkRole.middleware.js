import prisma from "../config/prisma.js";
import { createErrorUtil } from "../utils/createError.util.js";

export const checkRole = (roles) => async (req, res, next) => {
  const { id } = req.user;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!roles.includes(user?.role)) {
    createErrorUtil(403, "Permission Denied");
  }
  next();
};
