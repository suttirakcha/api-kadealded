import jwt from "jsonwebtoken";
import { createErrorUtil } from "../utils/createError.util";

export const authUserCheck = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    console.log("header", header);
    if (!header) {
      createErrorUtil(401, "token is missing");
    }
    const token = header.split(" ")[1];
    jwt.verify(token, process.env.SECRET, (error, decode) => {
      if (error) {
        createErrorUtil(401, "Unauthorized Token");
      }
      req.user = decode;
    });
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
