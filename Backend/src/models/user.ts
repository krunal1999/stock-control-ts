import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  gender: string;
  accessToken: string;
}

const userSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String, required: true },
    accessToken: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);
