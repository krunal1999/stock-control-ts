import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  gender: string;
  role: string;
  accessToken: string;
  address?: string;
}

const userSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    accessToken: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);
