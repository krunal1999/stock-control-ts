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
    const { fullName, email, password, mobile, gender } =
      req.body as RegisterUserDTO;

    const schema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      mobile: Joi.string().required(),
      gender: Joi.string().valid("male", "female", "other").required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json(new ApiError(error.message, 400));
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
