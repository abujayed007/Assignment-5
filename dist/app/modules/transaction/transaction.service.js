"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const transaction_model_1 = require("./transaction.model");
const getAllTransactions = async (payload) => {
    const transactions = await transaction_model_1.Transaction.find({});
    return transactions;
};
const getMyTransactions = async (id) => {
    return await transaction_model_1.Transaction.find({
        $or: [{ fromWallet: id }, { toWallet: id }],
    })
        .sort({ createdAt: -1 })
        .lean();
};
exports.TransactionServices = {
    getAllTransactions,
    getMyTransactions,
};
