import * as otpService from "../services/otp.service.js";

export const sendOtp = async (req, res, next) => {
  try {
    const { email, otp_type } = req.body;
    await otpService.sendOtp(email, otp_type);
    res.status(200).json({ message: "OTP Sent !" });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const {email, otp_code, otp_type} = req.body
    await otpService.verifyOtp(email, otp_code, otp_type)
    res.status(200).json({message: "OTP Verified !"})
  } catch (error) {
    next(error)
  }
}