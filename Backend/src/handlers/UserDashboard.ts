import { NextFunction, Request, Response } from "express";
import Product from "../models/Product";
import { ApiError, ApiSuccess } from "../utils/api-response";

export const getProductById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    res.status(200).json(new ApiSuccess(product, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to get product", 500, error));
  }
};
