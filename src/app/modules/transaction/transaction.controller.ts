import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthRequest } from "../../middlewares/checkAuth";
import AppError from "../../errorHelpers/AppError";

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const transactions = await TransactionServices.getAllTransactions(
    query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Transactions retrived successful",
    data: transactions,
  });
});

// controller
const getMyTransactions = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.user;

    const query = req.query as Record<string, string>;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }

    const transactions = await TransactionServices.getMyTransactions(
      userId,
      query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions.data,
      meta: transactions.meta,
    });
  }
);

export const TransactionControllers = {
  getAllTransactions,
  getMyTransactions,
};
