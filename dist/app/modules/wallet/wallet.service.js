"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const wallet_model_1 = require("./wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const getAllWallets = async (payload) => {
    const wallets = await wallet_model_1.Wallet.find({});
    return wallets;
};
const getMyWallet = async (userId) => {
    const wallet = await wallet_model_1.Wallet.findOne({ user: userId }).populate("user");
    return wallet;
};
const withdrawMoney = async (userPhone, agentPhone, balance) => {
    if (balance <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid balance");
    }
    const user = await user_model_1.User.findOne({ phone: userPhone });
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (user.role !== user_interface_1.Role.USER) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Only user can withdraw");
    }
    const userWallet = await wallet_model_1.Wallet.findOne({ user: user._id });
    if (!userWallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
    if (userWallet.balance < balance) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Not enough balance");
    }
    const agent = await user_model_1.User.findOne({ phone: agentPhone });
    if (!agent)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    if (agent.role !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "You can withdraw to only agent");
    }
    const agentWallet = await wallet_model_1.Wallet.findOne({ user: agent._id });
    if (!agentWallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent Wallet not found");
    if (agentWallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your agent wallet is blocked");
    }
    // Update balances
    userWallet.balance -= balance;
    await userWallet.save();
    agentWallet.balance += balance;
    await agentWallet.save();
    await transaction_model_1.Transaction.create({
        type: transaction_interface_1.TxnType.WITHDRAW,
        status: transaction_interface_1.TxnStatus.SUCCESS,
        balance,
        fromWallet: user._id,
        toWallet: agent._id,
    });
    return { userWallet, agentWallet };
};
const sendMoney = async (senderPhone, receiverPhone, balance) => {
    if (balance <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid balance");
    }
    // Sender
    const senderUser = await user_model_1.User.findOne({ phone: senderPhone });
    if (!senderUser)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender not found");
    if (senderUser.role !== user_interface_1.Role.USER)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Only user can Send money to another user");
    const senderWallet = await wallet_model_1.Wallet.findOne({ user: senderUser._id });
    if (!senderWallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender wallet not found");
    if (senderWallet.balance < balance) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Not enough balance");
    }
    // Receiver
    const receiverUser = await user_model_1.User.findOne({ phone: receiverPhone });
    if (!receiverUser)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver not found");
    if (receiverUser.role !== user_interface_1.Role.USER)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Only user can receive money from another user");
    const receiverWallet = await wallet_model_1.Wallet.findOne({ user: receiverUser._id });
    if (!receiverWallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet not found");
    // Validation for blocked user
    if (receiverWallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver is blocked");
    }
    // Update balances
    senderWallet.balance -= balance;
    await senderWallet.save();
    receiverWallet.balance += balance;
    await receiverWallet.save();
    await transaction_model_1.Transaction.create({
        type: transaction_interface_1.TxnType.SENDMONEY,
        status: transaction_interface_1.TxnStatus.SUCCESS,
        balance,
        fromWallet: senderUser._id,
        toWallet: receiverUser._id,
    });
    return { senderWallet, receiverWallet };
};
const addMoney = async (agentPhone, userPhone, balance) => {
    if (balance <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid balance");
    }
    // Sender
    const agent = await user_model_1.User.findOne({ phone: agentPhone });
    if (!agent)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    if (agent.role !== user_interface_1.Role.AGENT)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Only Agent can Send money to  user");
    const agentWallet = await wallet_model_1.Wallet.findOne({ user: agent._id });
    if (!agentWallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender wallet not found");
    if (agentWallet.balance < balance) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Not enough balance");
    }
    // Receiver
    const user = await user_model_1.User.findOne({ phone: userPhone });
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver not found");
    if (user.role !== user_interface_1.Role.USER)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Only user can receive money from another user");
    const userWallet = await wallet_model_1.Wallet.findOne({ user: user._id });
    if (!userWallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet not found");
    // Validation for blocked wallet
    if (userWallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver is blocked");
    }
    // Update balances
    agentWallet.balance -= balance;
    await agentWallet.save();
    userWallet.balance += balance;
    await userWallet.save();
    await transaction_model_1.Transaction.create({
        type: transaction_interface_1.TxnType.ADDMONEY,
        status: transaction_interface_1.TxnStatus.SUCCESS,
        balance,
        fromWallet: agent._id,
        toWallet: user._id,
    });
    return { agentWallet, userWallet };
};
const blockWallet = async (id, payload) => {
    const wallet = await wallet_model_1.Wallet.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    return wallet;
};
exports.WalletServices = {
    withdrawMoney,
    sendMoney,
    getAllWallets,
    getMyWallet,
    blockWallet,
    addMoney,
};
