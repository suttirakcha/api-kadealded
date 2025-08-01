import prisma from "../config/prisma.js";
import { generateOtpCode } from "../utils/generateOtp.js";
import { addMinutes } from "date-fns";
import { sendEmail } from "../utils/sendEmail.js";
import { createErrorUtil } from "../utils/createError.util.js";

export const sendOtp = async (email, otp_type = "VERIFY_EMAIL") => {
  const otp_code = generateOtpCode();
  const expires_at = addMinutes(new Date(), 5);

  await prisma.otp.create({
    data: { email, otp_code, otp_type, expires_at },
  });

  await sendEmail({
    to: email,
    subject: "kaDealded OTP Code",
    html: `<p>Yout OTP Code is <strong>${otp_code}</strong>. Expires in 5 minutes.</p>`,
  });
};

export const verifyOtp = async (email, otp_code, otp_type) => {
  const otp = await prisma.otp.findFirst({
    where: {
      email,
      otp_code,
      otp_type,
      used: false,
      expires_at: { gt: new Date() },
    },
  });

  if (!otp) {
    createErrorUtil(400, "Invalid or Expired OTP");
  }

  await prisma.otp.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
};
