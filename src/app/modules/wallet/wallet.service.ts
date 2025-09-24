/* eslint-disable @typescript-eslint/no-unused-vars */
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Transaction } from "../transaction/transaction.model";
import { TxnStatus, TxnType } from "../transaction/transaction.interface";
import { IWallet } from "./wallet.interface";

const getAllWallets = async (payload: IWallet) => {
  const wallets = await Wallet.find({});

  return wallets;
};

const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId }).populate("user");

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
    throw new AppError(httpStatus.NOT_FOUND, "Only user can withdraw");
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

  await Transaction.create({
    type: TxnType.WITHDRAW,
    status: TxnStatus.SUCCESS,
    balance,
    fromWallet: user._id,
    toWallet: agent._id,
  });

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

  if (senderUser.role !== Role.USER)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Only user can Send money to another user"
    );

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

  if (receiverUser.role !== Role.USER)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Only user can receive money from another user"
    );

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

  await Transaction.create({
    type: TxnType.SENDMONEY,
    status: TxnStatus.SUCCESS,
    balance,
    fromWallet: senderUser._id,
    toWallet: receiverUser._id,
  });

  return { senderWallet, receiverWallet };
};

const addMoney = async (
  agentPhone: string,
  userPhone: string,
  balance: number
) => {
  if (balance <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid balance");
  }

  // Sender
  const agent = await User.findOne({ phone: agentPhone });

  if (!agent) throw new AppError(httpStatus.NOT_FOUND, "Agent not found");

  if (agent.role !== Role.AGENT)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Only Agent can Send money to  user"
    );

  const agentWallet = await Wallet.findOne({ user: agent._id });
  if (!agentWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");

  if (agentWallet.balance < balance) {
    throw new AppError(httpStatus.BAD_REQUEST, "Not enough balance");
  }

  // Receiver
  const user = await User.findOne({ phone: userPhone });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "Receiver not found");

  if (user.role !== Role.USER)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Only user can receive money from another user"
    );

  const userWallet = await Wallet.findOne({ user: user._id });
  if (!userWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");

  // Validation for blocked wallet
  if (userWallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver is blocked");
  }

  // Update balances
  agentWallet.balance -= balance;
  await agentWallet.save();

  userWallet.balance += balance;
  await userWallet.save();

  await Transaction.create({
    type: TxnType.ADDMONEY,
    status: TxnStatus.SUCCESS,
    balance,
    fromWallet: agent._id,
    toWallet: user._id,
  });

  return { agentWallet, userWallet };
};

const blockWallet = async (id: string, payload: IWallet) => {
  const wallet = await Wallet.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  return wallet;
};

export const WalletServices = {
  withdrawMoney,
  sendMoney,
  getAllWallets,
  getMyWallet,
  blockWallet,
  addMoney,
};
