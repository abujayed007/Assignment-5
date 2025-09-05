"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.TxnType),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(transaction_interface_1.TxnStatus),
        default: transaction_interface_1.TxnStatus.SUCCESS,
    },
    balance: { type: Number, required: true },
    fromWallet: { type: mongoose_1.Types.ObjectId, ref: "Wallet" },
    toWallet: { type: mongoose_1.Types.ObjectId, ref: "Wallet" },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
