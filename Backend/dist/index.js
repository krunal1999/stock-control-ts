"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "16kb",
}));
app.use(express_1.default.json());
(0, db_1.connectDB)()
    .then(() => {
    console.log("MongoDB connected");
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
    console.error("Server is shutting down");
    process.exit(1);
});
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/users", users_1.default);
// make Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
app.get("/", (req, res, next) => {
    res.send("Server is Running : Health Check");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
