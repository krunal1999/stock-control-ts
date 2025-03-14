import { Router } from "express";
import {
  getAllVendor,
  getVendorByID,
  createNewVendor,
  deleteVendorById,
  updateExistingVendorbyId,
} from "../handlers/vendorHandler";
import {
  createNewPurchase,
  getAllPurchase,
  updatePurchaseOrder,
  updatePurchaseOrderComplete,
} from "../handlers/purchaseHandler";

const router = Router();

router.get("/vendor", getAllVendor);
router.get("/vendor/:id", getVendorByID);
router.post("/vendor", createNewVendor);
router.delete("/vendor/:id", deleteVendorById);
router.put("/vendor/:id", updateExistingVendorbyId);

router.post("/", createNewPurchase);
router.get("/", getAllPurchase);
router.put("/:id", updatePurchaseOrder);
router.put("/complete/:id", updatePurchaseOrderComplete);

export default router;
