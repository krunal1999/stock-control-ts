import { Router } from "express";
import { getgrapghData1 } from "../handlers/AdminGraghs";

const router = Router();

router.get("/dashboard1", getgrapghData1);

export default router;
