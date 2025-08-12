import prisma from "../config/prisma.js";
import { createErrorUtil } from "../utils/createError.util.js";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../utils/cloudinary.util.js"; 

export const registerService = async (data) => {
  console.log("data", data);
  const { name, last_name, tel_number, email, password, birth_date } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    createErrorUtil(400, "User Already Exist !");
  }
  const hash = bcrypt.hashSync(password, 10);

  let profileImageUrl = null
  if (data.profile_image && data.profile_image.length > 0) {
    const uploaded = await uploadToCloudinary(data.profile_image[0].path);
    profileImageUrl = uploaded.secure_url;
  };

  const result = await prisma.user.create({
    data: {
      name,
      last_name,
      tel_number,
      email,
      password: hash,
      birth_date: new Date(birth_date),
      profile_image: profileImageUrl,
    },
  });
  return result;
};

export const login = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      joinDeals: true
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