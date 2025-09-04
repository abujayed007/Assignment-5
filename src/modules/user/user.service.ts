import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";

const createUser = async (payload: Partial<IUser>) => {
  const { phone, password, ...rest } = payload;
  const isUserExist = await User.findOne({ phone });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    phone: payload.phone,
    password: hashedPassword,
    ...rest,
  });

  if (user.role !== Role.ADMIN) {
    await Wallet.create({
      user: user._id,
      balance: 50,
      isBlocked: false,
    });
  }

  return user;
};

export const UserServices = {
  createUser,
  // topUpBalance,
};
