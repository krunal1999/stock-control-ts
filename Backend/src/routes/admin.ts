import { Router } from "express";
import purchaseRoute from "./purchaseRoute";
import inventoryRoute from "./InventoryRoute";
const router = Router();

router.use("/purchase", purchaseRoute);
router.use("/inventory", inventoryRoute);
// router.put("/logoutuser", );

export default router;
