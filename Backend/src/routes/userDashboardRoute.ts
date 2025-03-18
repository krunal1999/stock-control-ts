import { Router, Request, Response, NextFunction } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import { getProductById } from "../handlers/UserDashboard";
import {
  addToCart,
  checkoutCart,
  checkoutSuccess,
  deleteCart,
  getCart,
  updateCart,
} from "../handlers/CartHandler";
const router = Router();

router.get(
  "/getuserdetails",
  authenticateJWT,
  (req: AuthRequest, res: Response) => {
    res.json({ message: "This is a protected route", user: req.user });
  }
);

router.get("/getproductdetails/:productId", getProductById);

router.post("/addtocart", addToCart);
router.get("/getcart", getCart);
router.put("/updatecart", updateCart);
router.delete("/deletecart/:productId", deleteCart);

router.post("/checkout", checkoutCart);
router.get("/checkout/success", checkoutSuccess);

export default router;
