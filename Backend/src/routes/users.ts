import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../handlers/users";

const router = Router();

router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);
router.put("/logoutuser", logoutUser);

export default router;
