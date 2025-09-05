"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const transaction_service_1 = require("./transaction.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const getAllTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const transactions = await transaction_service_1.TransactionServices.getAllTransactions(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.ACCEPTED,
        success: true,
        message: "All Transactions retrived successful",
        data: transactions,
    });
});
const getMyTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userPhone = req.user?.user;
    if (!userPhone) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unauthorized access");
    }
    const transactions = await transaction_service_1.TransactionServices.getMyTransactions(userPhone);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Transactions retrieved successfully",
        data: transactions,
    });
});
exports.TransactionControllers = {
    getAllTransactions,
    getMyTransactions,
};
