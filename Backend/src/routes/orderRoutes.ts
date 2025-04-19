import { Router } from "express";
import { getAllOrders, getAllOrdersByUserid } from "../handlers/Orders";
import { getAllDeliveryOrders } from "../handlers/Orders";
import {
  updateOrderStatus,
  updateOrderStatusByEmployee,
} from "../handlers/Orders";

const router = Router();

router.get("/", getAllOrders);
router.get("/user/:id", getAllOrdersByUserid);
router.get("/delivery", getAllDeliveryOrders);

router.put("/:orderId", updateOrderStatus);
router.put("/emp/:orderId", updateOrderStatusByEmployee);

export default router;
