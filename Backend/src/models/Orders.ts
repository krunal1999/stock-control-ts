import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  userRef: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    sellPrice: number;
    totalPrice: number;
  }[];
  totalPaid: number;
  status: "Paid" | "Unpaid";
  orderStatus: "Pending" | "Delivered" | "Hold" | "Cancelled" | "Confirmed";
  paymentId: string;
  paymentMethod: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    userRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        sellPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalPaid: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Paid",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Delivered", "Hold", "Cancelled", "Confirmed"],
      default: "Pending",
    },
    paymentId: { type: String, required: true },
    paymentMethod: { type: String, default: "Card" },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
