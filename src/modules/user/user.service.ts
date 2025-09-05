import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";

const getAllUsers = async (payload: Partial<IUser>) => {
  const users = await User.find();

  return users;
};

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

const userSuspendOrApproved = async (
  id: string,
  status: "ACTIVE" | "SUSPENDED"
) => {
  const agent = await User.findOneAndUpdate(
    { _id: id, role: Role.AGENT },
    { status },
    { new: true }
  );

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  return agent;
};

export const UserServices = {
  createUser,
  getAllUsers,
  userSuspendOrApproved,
};
