import prisma from "../config/prisma.js";
import { createErrorUtil } from "../utils/createError.util.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerService = async (data) => {
  console.log("data", data);
  const { name, email, password, birth_date } = data;

  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) {
    createErrorUtil(400, "User already exist !");
    res.status(400).json({ message: "User already exist" });
  }
  const hash = bcrypt.hashSync(password, 10);
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      birth_date: new Date(birth_date),
    },
  });
  return result;
};

export const login = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    createErrorUtil(400, "Email or Password invalid");
  }

  const checkPassword = bcrypt.compareSync(password, user.password);

  if (!checkPassword) {
    createErrorUtil(400, "Email or Password invalid");
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.SECRET,{ expiresIn: "1d" });
  delete user.password;
  return {user,token}
};
