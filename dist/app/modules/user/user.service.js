"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const wallet_model_1 = require("../wallet/wallet.model");
const getAllUsers = async (payload) => {
    const users = await user_model_1.User.find();
    return users;
};
const createUser = async (payload) => {
    const { phone, password, ...rest } = payload;
    const isUserExist = await user_model_1.User.findOne({ phone });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = await user_model_1.User.create({
        phone: payload.phone,
        password: hashedPassword,
        ...rest,
    });
    if (user.role !== user_interface_1.Role.ADMIN) {
        await wallet_model_1.Wallet.create({
            user: user._id,
            balance: 50,
            isBlocked: false,
        });
    }
    return user;
};
const userSuspendOrApproved = async (id, status) => {
    const agent = await user_model_1.User.findOneAndUpdate({ _id: id, role: user_interface_1.Role.AGENT }, { status }, { new: true });
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    return agent;
};
exports.UserServices = {
    createUser,
    getAllUsers,
    userSuspendOrApproved,
};
