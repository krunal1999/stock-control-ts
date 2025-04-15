import { Router } from "express";
import purchaseRoute from "./purchaseRoute";
import inventoryRoute from "./InventoryRoute";
import warehouseRoute from "./warehouseRoute";
import ordersRoute from "./orderRoutes";
import graphRoute from "./grapghRoute";
import { downloadCsv, downloadCsvPurchase } from "../handlers/ProductHandler";
import { downloadCsvCategory } from "../handlers/CategoryHandler";
import { downloadCsvOrder } from "../handlers/Orders";
const router = Router();

router.use("/purchase", purchaseRoute);
router.use("/inventory", inventoryRoute);
router.use("/warehouse", warehouseRoute);
router.use("/orders", ordersRoute);
router.use("/graph", graphRoute);
router.get("/export/csv/products", downloadCsv);
router.get("/export/csv/purchase", downloadCsvPurchase);
router.get("/export/csv/category", downloadCsvCategory);
router.get("/export/csv/order", downloadCsvOrder);

// router.put("/logoutuser", );

export default router;
