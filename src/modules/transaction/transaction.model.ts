import { model, Schema, Types } from "mongoose";
import { ITransaction } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ["add_money", "withdraw", "send", "cash_in", "cash_out"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    amount: { type: Number, required: true },
    fromWallet: { type: Types.ObjectId, ref: "Wallet" },
    toWallet: { type: Types.ObjectId, ref: "Wallet" },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
