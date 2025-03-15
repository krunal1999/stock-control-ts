import { Router, Request, Response, NextFunction } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import { getProductById } from "../handlers/UserDashboard";
const router = Router();

router.get(
  "/getuserdetails",
  authenticateJWT,
  (req: AuthRequest, res: Response) => {
    res.json({ message: "This is a protected route", user: req.user });
  }
);

router.get("/getproductdetails/:productId", getProductById);

export default router;
