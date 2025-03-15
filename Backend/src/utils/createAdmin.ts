import User from "../models/user";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "StrongAdminPass@123";

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const newAdmin = new User({
      fullName: "Admin User",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      mobile: "1231231231",
      gender: "male",
      role: "admin",
    });

    await newAdmin.save();
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

export default createAdminUser;
