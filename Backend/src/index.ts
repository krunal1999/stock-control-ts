import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users";
import adminRouter from "./routes/admin";
import multer from "multer";
import createAdminUser from "./utils/createAdmin";
import Stripe from "stripe";
import createEmployeeUser from "./utils/createEmployee";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

connectDB()
  .then(async () => {
    console.log("MongoDB connected");
    await createAdminUser();
    await createEmployeeUser();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    console.error("Server is shutting down");
    process.exit(1);
  });

app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", usersRouter);

app.use("/api/v1/admin", adminRouter);

// app.get(
//   "/api/v1/stripe/checkout",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const amount = 100;
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "gbp",
//             product_data: {
//               name: "Test Product",
//             },
//             unit_amount: amount * 100,
//           },
//           quantity: 2,
//         },
//         {
//           price_data: {
//             currency: "gbp",
//             product_data: {
//               name: "Test Product 2",
//             },
//             unit_amount: amount * 100,
//           },
//           quantity: 4,
//         },
//       ],
//       success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
//     });
//     console.log(session);
//     res.redirect(session.url || "");
//     // res.json({ url: session.url });
//   }
// );

// app.get(
//   "/api/v1/stripe/checkout/success",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const sessionId = req.query.session_id as string;
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     console.log(session);
//     res.json({ session });
//   }
// );

// make Global Error Handler

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Server is Running : Health Check");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
