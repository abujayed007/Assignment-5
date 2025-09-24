/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllUsers = async (payload: Partial<IUser>) => {
  const users = await User.find({});

  return users;
};

const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId);

  return user;
};

const getUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find({ role: Role.USER }), query);

  const userSearchableField = ["name", "phone"];

  const users = queryBuilder
    .search(userSearchableField)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getAgents = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find({ role: Role.AGENT }), query);

  const agentSearchableField = ["name", "phone"];

  const agents = queryBuilder
    .search(agentSearchableField)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    agents.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getMe = async (phone: string) => {
  const user = await User.findOne({ phone }).select("-password");
  return {
    data: user,
  };
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

const updateProfile = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (user.role === Role.USER || user.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.status) {
    if (user.role === Role.USER || user.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const userSuspendOrApproved = async (
  id: string,
  status: "APPROVED" | "SUSPENDED" | "PENDING"
) => {
  const agent = await User.findOneAndUpdate(
    { _id: id },
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  return agent;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getUsers,
  userSuspendOrApproved,
  getMe,
  updateProfile,
  getAgents,
  getSingleUser,
};
