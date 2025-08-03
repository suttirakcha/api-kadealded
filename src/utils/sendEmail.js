import nodemailer from "nodemailer";

console.log("DEBUG CHECK: EMAIL_USER loaded:", process.env.EMAIL_USER);
console.log("DEBUG CHECK: EMAIL_PASS loaded (first 5 chars):", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 5) + '...' : 'PASSWORD NOT LOADED');
// This will show us if the correct values are being read.

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};