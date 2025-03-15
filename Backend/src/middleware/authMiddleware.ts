import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "";

// Extend Request type to include "user"
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;

  const token =
    req.header("Authorization")?.split(" ")[1] || req.cookies?.accessToken;

  //   console.log(token);

  if (!token) {
    res.status(401).json({ message: "Unauthorized - No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    authReq.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden - Invalid token" });
    return;
  }
};
