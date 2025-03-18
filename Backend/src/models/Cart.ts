import mongoose, { Schema, Document } from "mongoose";

interface ICartProduct {
  productId: mongoose.Schema.Types.ObjectId;
  productName: string;
  quantity: number;
  sellPrice: number;
  totalPrice: number;
}

export interface ICart extends Document {
  userRef: mongoose.Schema.Types.ObjectId;
  products: ICartProduct[];
  grandTotal: number;
}

const CartSchema: Schema = new Schema(
  {
    userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        sellPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    grandTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", CartSchema);
