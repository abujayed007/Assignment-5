"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = require("./wallet.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getAllWallets = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const wallets = await wallet_service_1.WalletServices.getAllWallets(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.ACCEPTED,
        success: true,
        message: "All wallets retrive successful",
        data: wallets,
    });
});
const getMyWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req?.user.user;
    console.log(userId);
    const wallet = await wallet_service_1.WalletServices.getMyWallet(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.ACCEPTED,
        success: true,
        message: "Your wallet retrive successful",
        data: wallet,
    });
});
const withdrawMoney = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { balance, agentPhone } = req.body;
    const userPhone = req.user.phone;
    const result = await wallet_service_1.WalletServices.withdrawMoney(userPhone, agentPhone, balance);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.ACCEPTED,
        success: true,
        message: "Withdraw Money successful",
        data: result,
    });
});
const sendMoney = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { balance, receiverPhone } = req.body;
    const senderPhone = req.user.phone;
    const result = await wallet_service_1.WalletServices.sendMoney(senderPhone, receiverPhone, balance);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.ACCEPTED,
        success: true,
        message: "Send Money successful",
        data: result,
    });
});
const addMoney = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { balance, userPhone } = req.body;
    const agentPhone = req.user.phone;
    const result = await wallet_service_1.WalletServices.addMoney(agentPhone, userPhone, balance);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.ACCEPTED,
        success: true,
        message: `Add Money to ${agentPhone} successful`,
        data: result,
    });
});
const blockWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const wallet = await wallet_service_1.WalletServices.blockWallet(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.ACCEPTED,
        success: true,
        message: "Send Money successful",
        data: wallet,
    });
});
exports.WalletController = {
    getAllWallets,
    getMyWallet,
    withdrawMoney,
    sendMoney,
    blockWallet,
    addMoney,
};
