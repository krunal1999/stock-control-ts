import mongoose, { Schema, Document } from "mongoose";

interface ProductFormData extends Document {
  productName: string;
  costPrice: string;
  sellPrice: string;
  discountPrice: string;
  stock: string;
  locations: mongoose.Schema.Types.ObjectId[];
  volume: string;
  weight: string;
  length: string;
  breadth: string;
  height: string;
  countryOfOrigin: string;
  category: string;
  images: string[];
  minQuantityAlert: string;
  lowStockAlert: string;
  vendorDetails: string;
  quantity: string;
  productDescription: string;
  warehouseName: string;
  isDeleted: boolean;
  isActice: boolean;
}

const ProductSchema: Schema = new Schema({
  productName: { type: String, required: true, index: true },
  costPrice: { type: String, required: true },
  sellPrice: { type: String, required: true },
  discountPrice: { type: String },
  stock: { type: String, required: true },
  locations: [{ type: mongoose.Schema.Types.ObjectId, ref: "WarehouseCell" }],
  volume: { type: String },
  weight: { type: String },
  length: { type: String },
  breadth: { type: String },
  height: { type: String },
  countryOfOrigin: { type: String },
  category: { type: String, index: true },
  images: [{ type: String }],
  minQuantityAlert: { type: String },
  lowStockAlert: { type: String },
  vendorDetails: { type: String },
  quantity: { type: String },
  productDescription: { type: String },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  warehouseName: { type: String },
  isDeleted: { type: Boolean, default: false },
  isActice: { type: String, default: "Active" },
});

const Product = mongoose.model<ProductFormData>("Product", ProductSchema);

export default Product;
