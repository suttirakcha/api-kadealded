import prisma from "../config/prisma.js";
import { login, registerService } from "../services/auth.service.js";
import { createErrorUtil } from "../utils/createError.util.js";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

export const registerController = async (req, res, next) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json({ message: `Register K.${result.first_name} ${result.last_name} Successful` });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body);
    const userId = result.user.id;

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // only for HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Successfully logged in",
      ...result,
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const refreshTokenController = async (req, res) => {
  const token = req.cookies.authorization;
  if (!token) {
    createErrorUtil(401, "Unauthorized token");
  }
  try {
    const decoded = verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== token) {
      createErrorUtil(403, "Token is missing");
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token: newAccessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
