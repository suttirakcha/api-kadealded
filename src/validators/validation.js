import { object, ref, string } from "yup";

export const registerSchema = object({
  first_name: string().required("Please Enter your First Name"),
  last_name: string().required("Please Enter your Last Name"),
  tel_number: string().required("Please Enter Your Telephone Number"),
  email: string().email().required("Please Enter Your Email"),
  password: string().min(6).required("Please Enter Your Password"),
  confirmPassword : string().oneOf([ref("password"),null]).required("Password is not Matched")
});

export const loginSchema = object({
  email : string().required("Please Enter Your Email"),
  password : string().required("Please Enter Your Password")
})
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
