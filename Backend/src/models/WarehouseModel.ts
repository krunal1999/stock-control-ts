import mongoose, { Schema, Document } from "mongoose";

// The Warehouse stores only metadata (rows, cols).
// Instead of a 2D grid, it stores references to WarehouseCells.
export interface IWarehouse extends Document {
  rows: number;
  cols: number;
  cellVolume: number;
  cells: mongoose.Types.ObjectId[];
  warehouseName: string;
}

const WarehouseSchema = new Schema<IWarehouse>({
  rows: { type: Number, required: true },
  cols: { type: Number, required: true },
  cellVolume: { type: Number, required: true },
  cells: [{ type: mongoose.Schema.Types.ObjectId, ref: "WarehouseCell" }],
  warehouseName: { type: String },
});

const Warehouse =
  mongoose.models.Warehouse ||
  mongoose.model<IWarehouse>("Warehouse", WarehouseSchema);
export default Warehouse;
