import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  fullName: string;
  email: string;
  contactNumber: string;
  companyName: string;
  companyAddress: string;
  companyMobileNumber: string;
  brandName: string;
  countryOfOrigin: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact Number is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
      trim: true,
    },
    companyAddress: {
      type: String,
      required: [true, "Company Address is required"],
      trim: true,
    },
    companyMobileNumber: {
      type: String,
      required: [true, "Company Mobile Number is required"],
      trim: true,
    },
    brandName: {
      type: String,
      required: [true, "Brand Name is required"],
      trim: true,
    },
    countryOfOrigin: {
      type: String,
      required: [true, "Country of Origin is required"],
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Mark as not deleted by default
    },
  },
  { timestamps: true }
);

const Vendor =
  mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema);
export default Vendor;
