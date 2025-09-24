"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await user_service_1.UserServices.getAllUsers(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All users retrived successfully",
        data: users,
    });
});
const getSingleUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const user = await user_service_1.UserServices.getSingleUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User retrived successfully",
        data: user,
    });
});
const getUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const users = await user_service_1.UserServices.getUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All users retrived successfully",
        data: users,
    });
});
const getAgents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const users = await user_service_1.UserServices.getAgents(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Agents retrived successfully",
        data: users,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.getMe(decodedToken.phone);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your Profile Retrived Successfully",
        data: result,
    });
});
const createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User created successfully",
        data: user,
    });
});
const updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?.user;
    const body = req.body;
    const user = await user_service_1.UserServices.updateProfile(userId, body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your Profile Updated Successfully",
        data: user,
    });
});
const userSuspendOrApproved = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await user_service_1.UserServices.userSuspendOrApproved(id, status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: `User status ${status}`,
        data: result,
    });
});
exports.UserControllers = {
    createUser,
    getAllUsers,
    userSuspendOrApproved,
    getMe,
    updateProfile,
    getUsers,
    getAgents,
    getSingleUser,
};
