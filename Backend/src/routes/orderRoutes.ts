import { Router } from "express";
import { getAllOrders } from "../handlers/Orders";

const router = Router();

router.get("/", getAllOrders);

export default router;
