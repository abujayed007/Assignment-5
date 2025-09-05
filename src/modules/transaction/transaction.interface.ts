import { Types } from "mongoose";

export enum TxnType {
  ADDMONEY = "ADDMONEY",
  WITHDRAW = "WITHDRAW",
  SENDMONEY = "SENDMONEY",
  CASHIN = "CASHIN",
  CASHOUT = "CASHOUT",
}

export enum TxnStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface ITransaction {
  type: TxnType;
  status: TxnStatus;
  balance: number;
  fromWallet?: Types.ObjectId;
  toWallet?: Types.ObjectId;
}
