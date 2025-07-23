import { number, object, string } from "yup";

export const registerSchema = object({
  name: string().required("Enter you name"),
  email: string().email().required("enter email"),
  password: string().min(6).required("password is required"),
});
export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    const errMsg = error.errors.map((item) => item);
    const errTxt = errMsg.join(",");
    const mereErr = new Error(errTxt);
    next(mereErr);
  }
};
