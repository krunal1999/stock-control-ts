import mongoose, { Schema, Document } from "mongoose";

enum PurchaseStatus {
  PENDING = "Pending",
  RECEIVED = "Received",
  CANCELLED = "Cancelled",
}

interface IPurchase extends Document {
  category: string;
  productName: string;
  quantity: number;
  vendorRef: mongoose.Schema.Types.ObjectId;
  vendorName: string;
  productRef?: mongoose.Schema.Types.ObjectId;
  status: PurchaseStatus;
  orderComplete: boolean;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    category: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    vendorName: { type: String, required: true },
    vendorRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(PurchaseStatus),
      default: PurchaseStatus.PENDING,
    },
    orderComplete: { type: Boolean, default: false },
    orderId: { type: String, unique: true },
  },
  { timestamps: true }
);

// Pre-save Hook to Generate Sequential Order ID
PurchaseSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const lastPurchase = await PurchaseModel.findOne().sort({ createdAt: -1 });

  let nextId = 1;
  if (lastPurchase) {
    const lastOrderId = lastPurchase.orderId; // e.g., "PID-001"
    const match = lastOrderId.match(/PID-(\d+)/);
    if (match) {
      nextId = parseInt(match[1]) + 1;
    }
  }

  this.orderId = `PID-${nextId.toString().padStart(3, "0")}`;
  next();
});

const PurchaseModel = mongoose.model<IPurchase>("Purchase", PurchaseSchema);
export default PurchaseModel;
