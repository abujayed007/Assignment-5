"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const setCookie_1 = __importDefault(require("../../utils/setCookie"));
const credentialLogin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const loginInfo = await auth_service_1.AuthServices.credentialLogin(req.body);
    (0, setCookie_1.default)(res, loginInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Login successfully",
        data: loginInfo,
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Logout successfully",
        data: null,
    });
});
exports.AuthControllers = {
    credentialLogin,
    logout,
};
