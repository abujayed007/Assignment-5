/* eslint-disable @typescript-eslint/no-unused-vars */

import AppError from "../../errorHelpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "./transaction.model";
import httpStatus from "http-status-codes";
import { transactionSearchableField } from "./transaction.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllTransactions = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Transaction.find(), query);

  const transactions = await queryBuilder
    .search(transactionSearchableField)
    .filter()
    .sort()
    .fields()
    .paginate();

  transactions.modelQuery = transactions.modelQuery
    .populate("fromWallet")
    .populate("toWallet");

  const [data, meta] = await Promise.all([
    transactions.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getMyTransactions = async (
  userId: string,
  query: Record<string, string>
) => {
  // 1. Find the user's wallet
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet Not found");
  }

  // 2. Build query with QueryBuilder
  const queryBuilder = new QueryBuilder(
    Transaction.find({
      $or: [{ fromWallet: wallet.user }, { toWallet: wallet.user }],
    }),
    query
  );
  const transactionsQuery = queryBuilder
    .search(transactionSearchableField)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    transactionsQuery
      .build()
      .populate("fromWallet")
      .populate("toWallet")
      .exec(),
    queryBuilder.getMeta(),
  ]);
  console.log(data);

  return { data, meta };
};

export const TransactionServices = {
  getAllTransactions,
  getMyTransactions,
};
