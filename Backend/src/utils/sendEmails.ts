import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// https://www.youtube.com/watch?v=QDIOBsMBEI0&ab_channel=WebWizard
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_FROM_EMAIL_USER,
    pass: process.env.GMAIL_FROM_EMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text: string
) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_FROM_EMAIL_USER,
      to,
      subject,
      html,
      text,
    });
    // console.log(` Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
