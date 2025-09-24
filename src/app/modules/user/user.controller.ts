import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthRequest } from "../../middlewares/checkAuth";
import { JwtPayload } from "jsonwebtoken";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All users retrived successfully",
    data: users,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const user = await UserServices.getSingleUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User retrived successfully",
    data: user,
  });
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const users = await UserServices.getUsers(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All users retrived successfully",
    data: users,
  });
});

const getAgents = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const users = await UserServices.getAgents(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Agents retrived successfully",
    data: users,
  });
});

const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const decodedToken = req.user as JwtPayload;

  const result = await UserServices.getMe(decodedToken.phone);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Profile Retrived Successfully",
    data: result,
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

const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.user;
  const body = req.body;
  const user = await UserServices.updateProfile(userId, body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Profile Updated Successfully",
    data: user,
  });
});

const userSuspendOrApproved = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await UserServices.userSuspendOrApproved(id, status);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `User status ${status}`,
      data: result,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  userSuspendOrApproved,
  getMe,
  updateProfile,
  getUsers,
  getAgents,
  getSingleUser,
};
