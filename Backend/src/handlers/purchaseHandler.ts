import { Request, Response } from "express";
import Purchase from "../models/purchase";
import { ApiError, ApiSuccess } from "../utils/api-response";
import mongoose from "mongoose";

export const createNewPurchase = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { category, product, quantity, vendorId, productId, vendor } =
      req.body;

    if (!vendor || !product || !quantity || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0." });
    }

    const productRef = mongoose.Types.ObjectId.isValid(product)
      ? product
      : null;

    const purchase = await Purchase.create({
      category,
      productName: product,
      quantity,
      vendorName: vendor,
      productRef: productRef,
      vendorRef: vendorId,
      status: "Pending",
      orderComplete: false,
      orderId: undefined,
    });
    await purchase.save();

    res.status(200).json(new ApiSuccess(purchase, 200));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError("Failed to create purchase Order", 500, error));
  }
};

export const getAllPurchase = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const purchases = await Purchase.find();
    res.status(200).json(new ApiSuccess(purchases, 200));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError("Failed to get all purchases", 500, error));
  }
};

export const updatePurchaseOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  console.log(id);
  try {
    const purchase = await Purchase.findByIdAndUpdate(
      id,
      {
        status: "Received",
        orderComplete: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!purchase) {
      return res
        .status(404)
        .json(new ApiError("Purchase order not found", 404));
    }

    res
      .status(200)
      .json(new ApiSuccess({ message: "Purchase order updated" }, 200));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError("Failed to update purchase order", 500, error));
  }
};
