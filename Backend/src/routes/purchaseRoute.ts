import { Router } from "express";
import {
  getAllVendor,
  getVendorByID,
  createNewVendor,
  deleteVendorById,
  updateExistingVendorbyId,
} from "../handlers/vendorHandler";

const router = Router();

router.get("/vendor", getAllVendor);
router.get("/vendor/:id", getVendorByID);
router.post("/vendor", createNewVendor);
router.delete("/vendor/:id", deleteVendorById);
router.put("/vendor/:id", updateExistingVendorbyId);

export default router;
