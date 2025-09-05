/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { WalletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/checkAuth";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
  const wallets = await WalletServices.getAllWallets(req.body);
  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "All wallets retrive successful",
    data: wallets,
  });
});

const withdrawMoney = catchAsync(async (req: AuthRequest, res: Response) => {
  const { balance, agentPhone } = req.body;

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

const addMoney = catchAsync(async (req: AuthRequest, res: Response) => {
  const { balance, userPhone } = req.body;
  const agentPhone = req.user!.phone;

  const result = await WalletServices.addMoney(agentPhone, userPhone, balance);

  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: `Add Money to ${agentPhone} successful`,
    data: result,
  });
});

const blockWallet = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const wallet = await WalletServices.blockWallet(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Send Money successful",
    data: wallet,
  });
});

export const WalletController = {
  getAllWallets,
  withdrawMoney,
  sendMoney,
  blockWallet,
  addMoney,
};
