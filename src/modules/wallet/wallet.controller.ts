import { Request, Response } from "express";
import { WalletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { AuthRequest } from "../../middlewares/checkAuth";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";

const addMoney = catchAsync(async (req: AuthRequest, res: Response) => {
  try {
    const { balance } = req.body;
    if (!balance || balance <= 0) throw new AppError(400, "Invalid balance");

    const userId = req.user!._id;

    const wallet = await WalletServices.addMoney(userId, Number(balance));

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Deposit successful",
      data: wallet,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || "Something went wrong",
      data: null,
    });
  }
});

const withdrawMoney = catchAsync(async (req: AuthRequest, res: Response) => {
  const { balance, agentPhone } = req.body;
  console.log({ agentPhone });
  const userPhone = req.user!.phone;

  const result = await WalletServices.withdrawMoney(
    userPhone,
    agentPhone,
    balance
  );

  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Withdraw Money successful",
    data: result,
  });
});

const sendMoney = catchAsync(async (req: AuthRequest, res: Response) => {
  const { balance, receiverPhone } = req.body;
  const senderPhone = req.user!.phone;

  const result = await WalletServices.sendMoney(
    senderPhone,
    receiverPhone,
    balance
  );

  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Send Money successful",
    data: result,
  });
});

export const WalletController = {
  addMoney,
  withdrawMoney,
  sendMoney,
};
