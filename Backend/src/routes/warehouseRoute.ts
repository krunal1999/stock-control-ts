import { Router } from "express";
import {
  createWarehouse,
  getWarehouse,
  getAvailableCells,
  getAvailableCellbyLocation,
  getWarehouseTypes,
  getWarehouseByType,
} from "../handlers/warehouseHandler";
const router = Router();

router.post("/createwarehouse", createWarehouse);
router.get("/getwarehouse", getWarehouse);
router.get("/getavailablecells", getAvailableCells);
router.get("/getavailablecellbylocation", getAvailableCellbyLocation);
router.get("/getwarehousetypes", getWarehouseTypes);
router.get("/getwarehousebytype/:warehouseName", getWarehouseByType);

export default router;
