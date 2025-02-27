"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ApiSuccess = void 0;
class ApiSuccess {
    constructor(data, statusCode = 200) {
        this.success = true;
        this.data = data;
        this.statusCode = statusCode;
        this.message = "success";
    }
}
exports.ApiSuccess = ApiSuccess;
class ApiError {
    constructor(message, statusCode = 500, details) {
        this.success = false;
        this.message = "failed";
        this.error = { message, details };
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
