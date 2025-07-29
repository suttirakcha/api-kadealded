import { createErrorUtil } from "../utils/createError.util.js";
import prisma from "../config/prisma.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";

export const authUserCheck = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return next(createErrorUtil(401, "Missing refresh token"));
  }

  try {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return next(createErrorUtil(403, "Invalid refresh token"));
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    });

    res.setHeader("x-access-token", newAccessToken);
    req.user = decoded;
    next();
  } catch (error) {
    return next(error);
  }
};

// import { createErrorUtil } from "../utils/createError.util.js";
// import prisma from "../config/prisma.js";
// import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";

// export const authUserCheck = async (req, res, next) => {
//   const header = req.headers.authorization;
//   const accessToken = header?.split(" ")[1];
//   const refreshToken = req.cookies?.refreshToken;

//   if (!accessToken){
//     createErrorUtil(401, "Missing token");
//   }

//   try {
//     const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
//     req.user = decoded;
//     return next();
//   } catch (error){
//     if (error.name !== "TokenExpiredError" || !refreshToken){
//       createErrorUtil(401, "Invalid or expired token");
//     }
//   }

//   try {
//     const refreshDecoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     const user = await prisma.user.findUnique({ 
//       where: { id: refreshDecoded.id }
//     });

//     if (!user || user.refreshToken !== refreshToken){
//       createErrorUtil(403, "Invalid token");
//     }

//     const newAccessToken = generateAccessToken(user.id);
//     const newRefreshToken = generateRefreshToken(user.id);


//     await prisma.user.update({
//       where: { id: user.id },
//       data: { refreshToken: newRefreshToken }
//     });

//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000
//     });

//     res.setHeader("x-access-token", newAccessToken);
//     req.user = refreshDecoded;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };