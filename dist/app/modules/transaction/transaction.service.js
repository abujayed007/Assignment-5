"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("./transaction.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const transaction_constant_1 = require("./transaction.constant");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getAllTransactions = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find(), query);
    const transactions = await queryBuilder
        .search(transaction_constant_1.transactionSearchableField)
        .filter()
        .sort()
        .fields()
        .paginate();
    transactions.modelQuery = transactions.modelQuery
        .populate("fromWallet")
        .populate("toWallet");
    const [data, meta] = await Promise.all([
        transactions.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
};
const getMyTransactions = async (userId, query) => {
    // 1. Find the user's wallet
    const wallet = await wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet Not found");
    }
    // 2. Build query with QueryBuilder
    const queryBuilder = new QueryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find({
        $or: [{ fromWallet: wallet.user }, { toWallet: wallet.user }],
    }), query);
    const transactionsQuery = queryBuilder
        .search(transaction_constant_1.transactionSearchableField)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        transactionsQuery
            .build()
            .populate("fromWallet")
            .populate("toWallet")
            .exec(),
        queryBuilder.getMeta(),
    ]);
    console.log(data);
    return { data, meta };
};
exports.TransactionServices = {
    getAllTransactions,
    getMyTransactions,
};
