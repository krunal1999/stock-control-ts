import User from "../models/user";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const EMPLOYEE_EMAIL = process.env.EMPLOYEE_EMAIL;
const EMPLOYEE_PASSWORD = process.env.EMPLOYEE_PASSWORD || "admin@123";

const createEmployeeUser = async () => {
  if (!EMPLOYEE_EMAIL) {
    console.error("EMPLOYEE_EMAIL is not defined in .env file.");
    return;
  }
  try {
    const existingEmployee = await User.findOne({
      email: EMPLOYEE_EMAIL,
    });

    if (existingEmployee) {
      return;
    }

    const hashedPassword = await bcrypt.hash(EMPLOYEE_PASSWORD, 10);

    const newAdmin = new User({
      fullName: "Employee User",
      email: EMPLOYEE_EMAIL,
      password: hashedPassword,
      mobile: "1231231231",
      gender: "male",
      role: "employee",
    });

    await newAdmin.save();
    console.log("Employee user created successfully.");
  } catch (error) {
    console.error("Error creating employee user:", error);
  }
};

export default createEmployeeUser;
