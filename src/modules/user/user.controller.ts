import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthRequest } from "../../middlewares/checkAuth";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

// const topUpBalance = catchAsync(async (req: Request, res: Response) => {
//   // Safely get balance from body
//   const balance = req.body;

//   const user = (req as any).user as JwtPayload;
//   console.log({user});
//   const userId = user?.phone;

//   const wallet = await UserServices.topUpBalance(userId, balance);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Top up successfully",
//     data: wallet,
//   });
// });

export const UserControllers = {
  createUser,
  // topUpBalance,
};
