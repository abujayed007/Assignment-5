import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthRequest } from "../../middlewares/checkAuth";
import AppError from "../../errorHelpers/AppError";

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const transactions = await TransactionServices.getAllTransactions(req.body);
  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "All Transactions retrived successful",
    data: transactions,
  });
});

const getMyTransactions = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userPhone = req.user?.user;

    if (!userPhone) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }

    const transactions = await TransactionServices.getMyTransactions(userPhone);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  }
);

export const TransactionControllers = {
  getAllTransactions,
  getMyTransactions,
};
