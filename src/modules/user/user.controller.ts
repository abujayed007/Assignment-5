import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthRequest } from "../../middlewares/checkAuth";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All users retrived successfully",
    data: users,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

const userSuspendOrApproved = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await UserServices.userSuspendOrApproved(id, status);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `User ${status}ED`,
      data: result,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  userSuspendOrApproved,
};
