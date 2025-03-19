import { Router } from "express";
import { getAllOrders } from "../handlers/Orders";
import { getAllDeliveryOrders } from "../handlers/Orders";
import { updateOrderStatus } from "../handlers/Orders";

const router = Router();

router.get("/", getAllOrders);
router.get("/delivery", getAllDeliveryOrders);
router.put("/:orderId", updateOrderStatus);

export default router;
