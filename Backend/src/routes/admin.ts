import { Router } from "express";
import purchaseRoute from "./purchaseRoute";
import inventoryRoute from "./InventoryRoute";
import warehouseRoute from "./warehouseRoute";
import ordersRoute from "./orderRoutes";
import graphRoute from "./grapghRoute";
const router = Router();

router.use("/purchase", purchaseRoute);
router.use("/inventory", inventoryRoute);
router.use("/warehouse", warehouseRoute);
router.use("/orders", ordersRoute);
router.use("/graph", graphRoute);

// router.put("/logoutuser", );

export default router;
