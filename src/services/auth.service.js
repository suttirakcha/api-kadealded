import prisma from "../config/prisma.js";
import { createErrorUtil } from "../utils/createError.util.js";
import bcrypt from "bcryptjs";

export const registerService = async (data) => {
  console.log("data", data);
  const { first_name, last_name, tel_number, email, password, birth_date } = data;

  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) {
    createErrorUtil(400, "User Already Exist !");
  }
  const hash = bcrypt.hashSync(password, 10);
  const result = await prisma.user.create({
    data: {
      first_name,
      last_name,
      tel_number,
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
    omit: {
      refreshToken: true,
    },
  });

  if (!user) {
    createErrorUtil(400, "Email or Password invalid");
  }

  const checkPassword = bcrypt.compareSync(password, user.password);

  if (!checkPassword) {
    createErrorUtil(400, "Email or Password invalid");
  }

  delete user.password;
  return { user };
};
