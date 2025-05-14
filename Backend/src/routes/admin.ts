import { Router } from "express";
import purchaseRoute from "./purchaseRoute";
import inventoryRoute from "./InventoryRoute";
import warehouseRoute from "./warehouseRoute";
import ordersRoute from "./orderRoutes";
import graphRoute from "./grapghRoute";
import { downloadCsv, downloadCsvPurchase } from "../handlers/ProductHandler";
import { downloadCsvCategory } from "../handlers/CategoryHandler";
import { downloadCsvOrder } from "../handlers/Orders";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.use("/purchase", authenticateJWT, purchaseRoute);
router.use("/inventory", authenticateJWT, inventoryRoute);
router.use("/warehouse", authenticateJWT, warehouseRoute);
router.use("/orders", authenticateJWT, ordersRoute);
router.use("/graph", authenticateJWT, graphRoute);
router.get("/export/csv/products", authenticateJWT, downloadCsv);
router.get("/export/csv/purchase", authenticateJWT, downloadCsvPurchase);
router.get("/export/csv/category", authenticateJWT, downloadCsvCategory);
router.get("/export/csv/order", authenticateJWT, downloadCsvOrder);

// router.put("/logoutuser", );

export default router;
