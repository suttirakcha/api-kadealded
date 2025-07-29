import { contactUs } from "../services/contactUs.service.js";

export const controllerContactUs = async (req, res, next) => {
  try {
    const result = await contactUs(req.body);
    res
      .status(200)
      .json({
        message:
          "Thank you for submitting the form, we will contact you as soon as possible.",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
