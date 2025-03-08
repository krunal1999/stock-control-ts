import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from "../handlers/CategoryHandler";
const router = Router();

router.get("/category", getAllCategories);
router.post("/category", createCategory);
router.delete("/category/:categoryId", deleteCategory);

export default router;
