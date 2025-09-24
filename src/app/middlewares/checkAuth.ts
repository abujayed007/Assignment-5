/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import { Status } from "../modules/user/user.interface";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(403, "No token received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({
        phone: verifiedToken.phone,
      });

      if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (
        isUserExists.status === Status.PENDING ||
        isUserExists.status === Status.SUSPENDED
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExists.status}`
        );
      }

      if (!verifiedToken) {
        throw new AppError(403, `User not authorized ${verifiedToken}`);
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted");
      }

      req.user = verifiedToken as JwtPayload;

      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
