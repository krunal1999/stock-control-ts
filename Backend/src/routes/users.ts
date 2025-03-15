import { Router, Request, Response, NextFunction } from "express";
import { loginUser, logoutUser, registerUser } from "../handlers/users";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import userDashboardRouter from "../handlers/UserDashboard";
const router = Router();

router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);
router.put("/logoutuser", logoutUser);

router.get("/protected", authenticateJWT, (req: AuthRequest, res: Response) => {
  res.json({ message: "This is a protected route", user: req.user });
});

router.use("/userdashboard", userDashboardRouter);

export default router;
