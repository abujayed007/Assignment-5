/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const getAllTransactions = async (payload: ITransaction) => {
  const transactions = await Transaction.find({});
  return transactions;
};

const getMyTransactions = async (id: string) => {
  return await Transaction.find({
    $or: [{ fromWallet: id }, { toWallet: id }],
  })
    .sort({ createdAt: -1 })
    .lean();
};

export const TransactionServices = {
  getAllTransactions,
  getMyTransactions,
};
