import { Router } from "express";
import purchaseRoute from "./purchaseRoute";
import inventoryRoute from "./InventoryRoute";
import warehouseRoute from "./warehouseRoute";
const router = Router();

router.use("/purchase", purchaseRoute);
router.use("/inventory", inventoryRoute);
router.use("/warehouse", warehouseRoute);
// router.put("/logoutuser", );

export default router;
