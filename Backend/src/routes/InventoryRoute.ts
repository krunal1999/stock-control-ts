import { NextFunction, Request, Response, Router } from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from "../handlers/CategoryHandler";
import { createProduct, getAllProducts } from "../handlers/ProductHandler";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/category", getAllCategories);
router.post("/category", createCategory);
router.delete("/category/:categoryId", deleteCategory);

router.get("/product", getAllProducts);

// Middleware to handle multer errors
router.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size is too large" });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Too many files uploaded" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "Unexpected field in form data" });
    }
  }
  next(err);
});

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

router.post(
  "/product",
  upload.array("images", 10),
  (req: Request, res: Response, next: NextFunction) => {
    const multerReq = req as unknown as MulterRequest;
    return createProduct(multerReq, res, next);
  }
);

// router.delete("/product/:productId", deleteProduct);

// router.get("/", );
// router.post("/", );

export default router;
