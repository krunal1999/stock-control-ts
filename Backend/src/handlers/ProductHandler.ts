import { NextFunction, Request, Response } from "express";
import Product from "../models/Product";
import { ApiError, ApiSuccess } from "../utils/api-response";
import multer from "multer";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { allocateStorage } from "./warehouseHandler";
import WarehouseCell from "../models/WarehouseCellModel";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const products = await Product.find();
    res.status(200).json(new ApiSuccess(products, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to fetch products", 500, error));
  }
};

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

interface ProductData {
  productName: string;
  countryOfOrigin: string;
  category: string;
  vendorId: string;
}

export const createProduct = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const data = req.body;
    const images = req.files as Express.Multer.File[];

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(async (file) => {
        const uploadedFile: any = await uploadToCloudinary(
          file.buffer,
          file.mimetype
        );
        return uploadedFile?.secure_url;
      })
    );
    // console.log("Uploaded Images:", uploadedImages);

    // warehouse storage
    // console.log(data);
    const totalVolume = data.volume * data.quantity;
    // console.log(totalVolume);

    const allocatedCells = await allocateStorage({
      warehouseType: data.locationType,
      startingLocation: data.location,
      productVolume: totalVolume,
    });

    // console.log("allocatedCells", allocatedCells);
    if (!allocatedCells) {
      return res.status(400).json({ error: "Failed to allocate cells" });
    }

    const warehouseLocationCells = allocatedCells.map((cell: any) => cell._id);

    const product = await Product.create({
      ...data,
      locations: warehouseLocationCells,
      warehouseName: data.locationType,
      images: uploadedImages,
    });

    // console.log("product", product)
    if (!product) {
      return res.status(400).json({ error: "Failed to create product" });
    }

    // console.log(product._id);
    const temps = await Promise.all(
      allocatedCells.map(async (cell: any) => {
        return WarehouseCell.findByIdAndUpdate(
          cell._id,
          {
            $set: {
              isAvailable: false,
              usedVolume: cell.usedVolume,
              availableVolume: cell.availableVolume,
              product: product._id,
            },
          },
          { new: true }
        );
      })
    );
    if (!temps) {
      return res
        .status(400)
        .json({ error: "Failed to update warehouse cells" });
    }

    // console.log(temps); // Now temps will contain the resolved results

    res.status(201).json(new ApiSuccess("Product created successfully", 201));
  } catch (error) {
    console.log("Failed to create product", error);
    next(new ApiError("Failed to create product", 500, error));
  }
};
