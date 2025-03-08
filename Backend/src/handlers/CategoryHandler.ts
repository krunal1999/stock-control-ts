import { Request, Response } from "express";
import Category from "../models/Category";
import { ApiError, ApiSuccess } from "../utils/api-response";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const categories = await Category.find();
    res.status(200).json(new ApiSuccess(categories, 200));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError("Failed to fetch categories", 500, error));
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json(new ApiError("category name is required", 400));
  }

  try {
    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      return res.status(400).json(new ApiError("Category already exists", 400));
    }

    const category = new Category({ categoryName });
    await category.save();

    res.status(201).json(new ApiSuccess("Category created successfully", 201));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Failed to create category", 500, error));
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json(new ApiError("Category not found", 404));
    }
    res.status(200).json(new ApiSuccess("Category deleted successfully", 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to delete category", 500, error));
  }
};
