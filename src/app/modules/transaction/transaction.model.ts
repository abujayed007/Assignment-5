import { model, Schema, Types } from "mongoose";
import { ITransaction, TxnStatus, TxnType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TxnType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TxnStatus),
      default: TxnStatus.SUCCESS,
    },
    balance: { type: Number, required: true },
    fromWallet: { type: Types.ObjectId, ref: "User" },
    toWallet: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
