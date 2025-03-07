import { Router } from "express";
import purchaseRoute from "./purchaseRoute";
const router = Router();

router.use("/purchase", purchaseRoute);
// router.post("/loginuser", );
// router.put("/logoutuser", );

export default router;
