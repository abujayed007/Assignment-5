"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawSchema = exports.isBlockedSchema = exports.sendMoneySchema = exports.addMoneySchema = exports.createWalletValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createWalletValidation = zod_1.default.object({
    user: zod_1.default.string().optional(),
    balance: zod_1.default.string().optional(),
    isBlocked: zod_1.default.boolean().optional(),
});
exports.addMoneySchema = zod_1.default.object({
    userPhone: zod_1.default.string("User phone number is required"),
    balance: zod_1.default.number().positive("Balance Must be a positive number"),
});
exports.sendMoneySchema = zod_1.default.object({
    receiverPhone: zod_1.default.string("User phone number is required"),
    balance: zod_1.default.number().positive("Balance Must be a positive number"),
});
exports.isBlockedSchema = zod_1.default.object({
    isBlocked: zod_1.default.boolean(),
});
exports.withdrawSchema = zod_1.default.object({
    agentPhone: zod_1.default.string({ message: "Phone is required" }),
    balance: zod_1.default
        .number("Balance is required")
        .positive("Balance Must be a positive number"),
});
