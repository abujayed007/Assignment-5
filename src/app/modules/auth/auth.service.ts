/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IUser, Status } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createUserToken } from "../../utils/userToken";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { phone, password } = payload;

  const isUserExists = await User.findOne({ phone });

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (
    isUserExists.status === Status.BLOCKED ||
    isUserExists.status === Status.SUSPENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You are ${isUserExists.status}. Please contact with our support team`
    );
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExists.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const userTokens = createUserToken(isUserExists);

  const { password: pass, ...rest } = isUserExists.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

export const AuthServices = {
  credentialLogin,
};
