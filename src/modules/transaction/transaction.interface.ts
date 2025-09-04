import { Types } from "mongoose";

export type TxnType =
  | "add_money"
  | "withdraw"
  | "send"
  | "cash_in"
  | "cash_out";

export type TxnStatus = "pending" | "success" | "failed";

export interface ITransaction {
  type: TxnType;
  status: TxnStatus;
  amount: number;
  fromWallet?: Types.ObjectId;
  toWallet?: Types.ObjectId;
}
