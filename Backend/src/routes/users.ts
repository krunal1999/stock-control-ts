import { Router } from "express";
import { registerUser } from "../handlers/users";

const router = Router();

router.post("/registerUser", registerUser);

export default router;
