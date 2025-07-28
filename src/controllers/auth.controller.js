import { login, registerService } from "../services/auth.service.js";

export const registerController = async (req, res, next) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json({ message: `Register ${result.name} successful` });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body);
    res.status(201).json({ message: "Successfully logged in", ...result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
