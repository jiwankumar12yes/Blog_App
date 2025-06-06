import nodemailer from "nodemailer";
import env from "../config/env";

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: `"My Blog" <${env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  // ✅ Log preview URL in console
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
