import mongoose, { Schema, Document } from "mongoose";

// Each warehouse cell is a separate document in MongoDB.
// It stores row, column, and volume.
// If a product is stored, it saves a reference (ObjectId) to Product.

export interface IWarehouseCell extends Document {
  row: number;
  col: number;
  totalVolume: number;
  usedVolume: number;
  availableVolume: number;
  location: string;
  isAvailable: boolean;
  product?: mongoose.Types.ObjectId | null;
}

const WarehouseCellSchema = new Schema<IWarehouseCell>({
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  totalVolume: { type: Number, required: true },

  usedVolume: { type: Number },
  availableVolume: { type: Number },
  location: { type: String },
  isAvailable: { type: Boolean, required: true, default: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
});

const WarehouseCell =
  mongoose.models.WarehouseCell ||
  mongoose.model<IWarehouseCell>("WarehouseCell", WarehouseCellSchema);
export default WarehouseCell;
