import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginUserDTO, RegisterUserDTO } from "../dtos/User.dto";
import User from "../models/user";
import Joi from "joi";
import { ApiError, ApiSuccess } from "../utils/api-response";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { fullName, email, password, mobile, gender, address } =
      req.body as RegisterUserDTO;

    const schema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      mobile: Joi.string().required(),
      gender: Joi.string().valid("male", "female", "other").required(),
      address: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(new ApiError("Email already exists", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      fullName,
      email,
      mobile,
      gender,
      password: hashedPassword,
      role: "user",
      address,
    });

    const newUserCreated = await user.save();

    if (!newUserCreated) {
      return res.status(500).json(new ApiError("Failed to register user", 500));
    }

    res.status(201).json(new ApiSuccess("User registered successfully", 201));
  } catch (error) {
    console.error("Registration error:", error); // Log the error
    res.status(500).json(new ApiError("Failed to register user", 500, error));
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body as LoginUserDTO;

    if (!email || !password) {
      return res
        .status(401)
        .json(new ApiError("Email and password are required", 401));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json(new ApiError("Invalid email or password", 401));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password doesn't match, sending 401 response");
      return res
        .status(401)
        .json(new ApiError("Invalid email or password", 401));
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    console.log(accessToken);
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000, // 12h in milliseconds
    });

    return res
      .status(200)
      .json(new ApiSuccess({ message: "Login successful", userData }, 200));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(new ApiError("Login failed", 500, error));
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  res.clearCookie("accessToken");
  res.status(200).json(new ApiSuccess({ message: "Logout successful" }, 200));
};
