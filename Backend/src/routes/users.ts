import { Router, Request, Response, NextFunction } from "express";
import { loginUser, logoutUser, registerUser } from "../handlers/users";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import userDashboardRouter from "./userDashboardRoute";
import { sendEmail } from "../utils/sendEmails";
const router = Router();
import dotenv from "dotenv";
dotenv.config();

router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);
router.put("/logoutuser", logoutUser);

router.get("/protected", authenticateJWT, (req: AuthRequest, res: Response) => {
  res.json({ message: "This is a protected route", user: req.user });
});

router.use("/userdashboard", authenticateJWT, userDashboardRouter);

router.post("/sendemail", async (req: Request, res: Response) => {
  const data = req.body;
  // console.log(data);

  const to = process.env.GMAIL_FROM_EMAIL_USER as string;
  const subject = "Contact Us Form Submission";
  const html = `<h1>Contact Us Form Submission</h1>
  <h2>email From: ${data.email}</h2>
  <h2>name: ${data.name}</h2>
  <h2>Message</h2>
  <p>${data.message}</p>`;
  const text = `Contact Us Form Submission`;

  try {
    const emailSent = await sendEmail(to, subject, html, text);
    if (emailSent) {
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send email" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
