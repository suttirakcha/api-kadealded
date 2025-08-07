import { verifyToken } from "../utils/jwt.js";
import prisma from "../config/prisma.js";
import { createErrorUtil } from "../utils/createError.util.js";

export const authUserCheck = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return next(createErrorUtil(401, "Missing refresh token"));

    const decoded = verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.refreshToken !== token) {
      return next(createErrorUtil(401, "Invalid refresh token"));
    }

    req.user = { id: user.id, role: user.role }; // เพิ่ม role เข้าไปให้ checkRole ใช้ต่อได้
    next();
  } catch (err) {
    next(err);
  }
};