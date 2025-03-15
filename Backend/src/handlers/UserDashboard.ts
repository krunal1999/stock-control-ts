import { Router, Request, Response, NextFunction } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/getuserdetails",
  authenticateJWT,
  (req: AuthRequest, res: Response) => {
    res.json({ message: "This is a protected route", user: req.user });
  }
);

export default router;
