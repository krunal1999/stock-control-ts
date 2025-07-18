import { NextFunction, Request, Response } from "express";
import { ApiError, ApiSuccess } from "../utils/api-response";
import multer from "multer";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { allocateStorage } from "./warehouseHandler";
import WarehouseCell from "../models/WarehouseCellModel";
import mongoose from "mongoose";
import { Parser } from "json2csv";

import PurchaseModel from "../models/purchase";
import Product from "../models/Product";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const products = await Product.find({ isDeleted: { $ne: true } });
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

// export const addProductToInventory = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const order = req.body;
//     console.log(order);

//     let product: any;
//     if (order?.productRef !== null) {
//       product = await Product.findById(order?.productRef);
//       if (!product) {
//         return res.status(400).json({ error: "Product not found" });
//       }
//       console.log(product);
//     }

//     if (!product) {
//       return res.status(400).json({ error: "Product not found" });
//     }

//     // warehouse storage
//     // console.log(data);
//     const totalVolume = product?.volume * order?.quantity;
//     // console.log(totalVolume);

//     const allocatedCells = await allocateStorage({
//       warehouseType: product?.warehouseName,
//       startingLocation: product?.locations[0],
//       productVolume: totalVolume,
//     });

//     console.log("allocatedCells", allocatedCells);
//     if (typeof allocatedCells === "string") {
//       return res.status(400).json({ error: "Failed to allocate cells" });
//     }

//     const warehouseLocationCells = allocatedCells.map((cell: any) => cell._id);

//     const temps = await Promise.all(
//       allocatedCells.map(async (cell: any) => {
//         return WarehouseCell.findByIdAndUpdate(
//           cell._id,
//           {
//             $set: {
//               isAvailable: false,
//               usedVolume: cell.usedVolume,
//               availableVolume: cell.availableVolume,
//               product: product._id,
//             },
//           },
//           { new: true }
//         );
//       })
//     );
//     if (!temps) {
//       return res
//         .status(400)
//         .json({ error: "Failed to update warehouse cells" });
//     }

//     let totalQuantity = Number(product?.quantity) + Number(order?.quantity);
//     let orderQuantity = Number(order?.quantity);

//     const updatedProduct = await Product.findByIdAndUpdate(
//       order?.productRef,
//       {
//         $set: { quantity: totalQuantity, stock: totalQuantity },
//         $push: { locations: warehouseLocationCells },
//       },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(400).json({ error: "Failed to update product" });
//     }

//     const purchaseOrder = await PurchaseModel.findByIdAndUpdate(
//       order?._id,
//       {
//         $set: { status: "completed" },
//       },
//       { new: true }
//     );

//     if (!purchaseOrder) {
//       return res.status(400).json({ error: "Failed to update purchase order" });
//     }

//     res.status(200).json(new ApiSuccess("Product added to inventory", 200));
//   } catch (error) {
//     console.log("Failed to add product to inventory", error);
//     res
//       .status(500)
//       .json(new ApiError("Failed to add product to inventory", 500, error));
//   }
// };

export const addProductToInventory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = req.body;
    // console.log(order);

    let product: any;
    if (order?.productRef !== null) {
      product = await Product.findById(order?.productRef).session(session); // Pass the session
      if (!product) {
        return res.status(400).json({ error: "Product not found" });
      }
      // console.log(product);
    }

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    const totalVolume = product?.volume * order?.quantity;

    const allocatedCells = await allocateStorage({
      warehouseType: product?.warehouseName,
      startingLocation: product?.locations[0],
      productVolume: totalVolume,
    });

    // console.log("allocatedCells", allocatedCells);
    if (typeof allocatedCells === "string") {
      return res.status(400).json({ error: "Failed to allocate cells" });
    }

    const warehouseLocationCells = allocatedCells.map((cell: any) => cell._id);

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
          { new: true, session }
        );
      })
    );

    if (!temps) {
      return res
        .status(400)
        .json({ error: "Failed to update warehouse cells" });
    }

    let totalQuantity = Number(product?.quantity) + Number(order?.quantity);

    const updatedProduct = await Product.findByIdAndUpdate(
      order?.productRef,
      {
        $set: { quantity: totalQuantity, stock: totalQuantity },
        $push: { locations: warehouseLocationCells },
      },
      { new: true, session }
    );

    if (!updatedProduct) {
      return res.status(400).json({ error: "Failed to update product" });
    }

    const purchaseOrder = await PurchaseModel.findByIdAndUpdate(
      order?._id,
      {
        $set: { status: "Completed" },
      },
      { new: true, session }
    );

    if (!purchaseOrder) {
      return res.status(400).json({ error: "Failed to update purchase order" });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(new ApiSuccess("Product added to inventory", 200));
  } catch (error) {
    await session.abortTransaction(); // Abort the transaction if there's an error
    session.endSession();

    console.log("Failed to add product to inventory", error);
    res
      .status(500)
      .json(new ApiError("Failed to add product to inventory", 500, error));
  }
};

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

export const downloadCsv = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const products = await Product.find().lean();

    const productSchemaFields = Object.keys(Product.schema.paths).filter(
      (field) => !["_id", "__v", "locations"].includes(field)
    );

    const fields = productSchemaFields;
    const parser = new Parser({ fields });
    const csv = parser.parse(products);

    res.header("Content-Type", "text/csv");
    res.attachment("products.csv");
    res.send(csv);
    // res.status(200).json(new ApiSuccess(product, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to get product", 500, error));
  }
};

export const downloadCsvPurchase = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data = await PurchaseModel.find().lean();

    const schemaFields = Object.keys(PurchaseModel.schema.paths).filter(
      (field) => !["_id", "__v"].includes(field)
    );

    const fields = schemaFields;
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("purchase.csv");
    res.send(csv);
    // res.status(200).json(new ApiSuccess(product, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to get purchase", 500, error));
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // Fields that can be updated
    const allowedFields = [
      "productName",
      "costPrice",
      "sellPrice",
      "discountPrice",
      "countryOfOrigin",
      "category",
      "minQuantityAlert",
      "lowStockAlert",
      "productDescription",
      "isActice",
    ];

    // Filter the update data to only include allowed fields
    const filteredData = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    // Validation
    if (Object.keys(filteredData).length === 0) {
      return res
        .status(400)
        .json(new ApiError("No valid fields to update", 400));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json(new ApiError("Product not found", 404));
    }

    return res.status(200).json(
      new ApiSuccess(
        {
          message: "Product updated successfully",
        },
        200
      )
    );
  } catch (error) {
    console.error("Failed to update product:", error);
    return res
      .status(500)
      .json(new ApiError("Failed to update product", 500, error));
  }
};

// delete product
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(new ApiError("Product not found", 404));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(500)
        .json(new ApiError("Failed to delete product", 500));
    }

    return res.status(200).json(
      new ApiSuccess(
        {
          message: "Product deleted successfully",
        },
        200
      )
    );
  } catch (error) {
    console.error("Failed to delete product:", error);
    return res
      .status(500)
      .json(new ApiError("Failed to delete product", 500, error));
  }
};
