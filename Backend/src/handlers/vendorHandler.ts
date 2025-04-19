import { Request, Response } from "express";
import Vendor from "../models/vendor";
import { ApiError, ApiSuccess } from "../utils/api-response";

// Get vendor by ID
export const getVendorByID = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findOne({ _id: vendorId, isDeleted: false });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(new ApiSuccess(vendor, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to get vendor", 500, error));
  }
};

// Get all vendors
export const getAllVendor = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const vendors = await Vendor.find({ isDeleted: false });
    res.status(200).json(new ApiSuccess(vendors, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to get all vendors", 500, error));
  }
};

// Create new vendor
export const createNewVendor = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const vendorData = req.body;

    const vendorDataWithoutId = { ...vendorData };
    if (vendorDataWithoutId._id) {
      delete vendorDataWithoutId._id;
    }

    // console.log("new vendorData", vendorDataWithoutId);

    const newVendor = await Vendor.create(vendorDataWithoutId);
    res.status(201).json(new ApiSuccess(newVendor, 201));
  } catch (error: any) {
    console.log(error);

    // Check for duplicate key error
    if (error.code === 11000 || error.keyPattern?.vendorEmail) {
      return res
        .status(409)
        .json(new ApiError("Vendor email already exists", 409, error));
    }

    res.status(500).json(new ApiError("Failed to create vendor", 500, error));
  }
};

// Delete vendor by ID
export const deleteVendorById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // await Vendor.findByIdAndDelete(vendorId);
    vendor.isDeleted = true;
    await vendor.save();

    res
      .status(200)
      .json(new ApiSuccess({ message: "Vendor deleted successfully" }, 200));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Failed to delete vendor", 500, error));
  }
};

// Update existing vendor by ID
export const updateExistingVendorbyId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const vendorId = req.params.id;
    const updateData = req.body;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const newVendor = await Vendor.findByIdAndUpdate(vendorId, updateData, {
      new: true,
      runValidators: true,
    });
    console.log(newVendor);
    res.status(200).json(new ApiSuccess(newVendor, 200));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Failed to update vendor", 500, error));
  }
};
