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
    const query = req.query;
    const transactions = await transaction_service_1.TransactionServices.getAllTransactions(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Transactions retrived successful",
        data: transactions,
    });
});
// controller
const getMyTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?.user;
    const query = req.query;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unauthorized access");
    }
    const transactions = await transaction_service_1.TransactionServices.getMyTransactions(userId, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Transactions retrieved successfully",
        data: transactions.data,
        meta: transactions.meta,
    });
});
exports.TransactionControllers = {
    getAllTransactions,
    getMyTransactions,
};
