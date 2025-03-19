import { Request, Response } from "express";
import { ApiError, ApiSuccess } from "../utils/api-response";
import Order from "../models/Orders";

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const orders = await Order.find().populate("userRef", "fullName email");
    res.status(200).json(new ApiSuccess(orders, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to fetch orders", 500, error));
  }
};
