"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const joi_1 = __importDefault(require("joi"));
const api_response_1 = require("../utils/api-response");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, mobile, gender } = req.body;
        const schema = joi_1.default.object({
            fullName: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(6).required(),
            mobile: joi_1.default.string().required(),
            gender: joi_1.default.string().valid("male", "female", "other").required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        // Check if email already exists
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json(new api_response_1.ApiError("Email already exists", 409));
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 8);
        const user = new user_1.default({
            fullName,
            email,
            mobile,
            gender,
            password: hashedPassword,
        });
        const newUserCreated = yield user.save();
        if (!newUserCreated) {
            return res.status(500).json(new api_response_1.ApiError("Failed to register user", 500));
        }
        res.status(201).json(new api_response_1.ApiSuccess("User registered successfully", 201));
    }
    catch (error) {
        console.error("Registration error:", error); // Log the error
        res.status(500).json(new api_response_1.ApiError("Failed to register user", 500, error));
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json(new api_response_1.ApiError("Invalid email or password", 401));
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res
                .status(401)
                .json(new api_response_1.ApiError("Invalid email or password", 401));
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "30m",
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000 / 2, // 30m in milliseconds
        });
        res.status(200).json(new api_response_1.ApiSuccess({ message: "Login successful" }, 200));
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json(new api_response_1.ApiError("Login failed", 500, error));
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken");
    res.status(200).json(new api_response_1.ApiSuccess({ message: "Logout successful" }, 200));
});
exports.logoutUser = logoutUser;
