import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users";
import adminRouter from "./routes/admin";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.json());

connectDB()
  .then(() => {
    console.log("MongoDB connected");
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
