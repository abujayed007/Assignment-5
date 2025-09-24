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
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getAllUsers = async (payload) => {
    const users = await user_model_1.User.find({});
    return users;
};
const getSingleUser = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    return user;
};
const getUsers = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find({ role: user_interface_1.Role.USER }), query);
    const userSearchableField = ["name", "phone"];
    const users = queryBuilder
        .search(userSearchableField)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        users.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
};
const getAgents = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find({ role: user_interface_1.Role.AGENT }), query);
    const agentSearchableField = ["name", "phone"];
    const agents = queryBuilder
        .search(agentSearchableField)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        agents.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
};
const getMe = async (phone) => {
    const user = await user_model_1.User.findOne({ phone }).select("-password");
    return {
        data: user,
    };
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
const updateProfile = async (userId, payload) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (payload.role) {
        if (user.role === user_interface_1.Role.USER || user.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.status) {
        if (user.role === user_interface_1.Role.USER || user.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = await bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
};
const userSuspendOrApproved = async (id, status) => {
    const agent = await user_model_1.User.findOneAndUpdate({ _id: id }, { status }, {
        new: true,
        runValidators: true,
    });
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    return agent;
};
exports.UserServices = {
    createUser,
    getAllUsers,
    getUsers,
    userSuspendOrApproved,
    getMe,
    updateProfile,
    getAgents,
    getSingleUser,
};
