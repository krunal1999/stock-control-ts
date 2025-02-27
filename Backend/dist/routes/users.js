"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../handlers/users");
const router = (0, express_1.Router)();
router.post("/registeruser", users_1.registerUser);
router.post("/loginuser", users_1.loginUser);
router.put("/logoutuser", users_1.logoutUser);
exports.default = router;
