import { Types } from "mongoose";
import { Wallet } from "./wallet.model";
import { IWallet } from "./wallet.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Role, Status } from "../user/user.interface";

const addMoney = async (userId: string, balance: number): Promise<IWallet> => {
  if (balance <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid balance");
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  wallet.balance += Number(balance);
  await wallet.save();

  return wallet;
};

const withdrawMoney = async (
  userPhone: string,
  agentPhone: string,
  balance: number
) => {
  if (balance <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid balance");
  }

  const user = await User.findOne({ phone: userPhone });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  if (user.role !== Role.USER) {
    throw new AppError(httpStatus.NOT_FOUND, "You are not a user");
  }

  const userWallet = await Wallet.findOne({ user: user._id });
  if (!userWallet)
    throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");

  if (userWallet.balance < balance) {
    throw new AppError(httpStatus.BAD_REQUEST, "Not enough balance");
  }

  const agent = await User.findOne({ phone: agentPhone });

  if (!agent) throw new AppError(httpStatus.NOT_FOUND, "Agent not found");

  if (agent.role !== Role.AGENT) {
    throw new AppError(httpStatus.NOT_FOUND, "You can withdraw to only agent");
  }

  const agentWallet = await Wallet.findOne({ user: agent._id });

  if (!agentWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Agent Wallet not found");

  if (agentWallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your agent wallet is blocked");
  }

  // Update balances
  userWallet.balance -= balance;
  await userWallet.save();

  agentWallet.balance += balance;
  await agentWallet.save();

  return { userWallet, agentWallet };
};

const sendMoney = async (
  senderPhone: string,
  receiverPhone: string,
  balance: number
) => {
  if (balance <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid balance");
  }

  // Sender
  const senderUser = await User.findOne({ phone: senderPhone });
  if (!senderUser) throw new AppError(httpStatus.NOT_FOUND, "Sender not found");

  const senderWallet = await Wallet.findOne({ user: senderUser._id });
  if (!senderWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");

  if (senderWallet.balance < balance) {
    throw new AppError(httpStatus.BAD_REQUEST, "Not enough balance");
  }

  // Receiver
  const receiverUser = await User.findOne({ phone: receiverPhone });
  if (!receiverUser)
    throw new AppError(httpStatus.NOT_FOUND, "Receiver not found");

  const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
  if (!receiverWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");

  // Validation for blocked user
  if (receiverWallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver is blocked");
  }

  // Update balances
  senderWallet.balance -= balance;
  await senderWallet.save();

  receiverWallet.balance += balance;
  await receiverWallet.save();

  return { senderWallet, receiverWallet };
};

export const WalletServices = {
  addMoney,
  withdrawMoney,
  sendMoney,
};
