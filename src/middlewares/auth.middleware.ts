import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils";
import { env } from "../config/config";
import prisma from "../db/db";
import { IRequestUser } from "../helper/auth.helper";
import { User } from "../generated/prisma";

type TOmitUser = Omit<User, "password" | "refreshToken">;

const authVerifyJwt = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req?.headers["authorization"]?.replace("Bearer", "").trim();

    if (!token) {
      throw new ApiError(401, "Access tokens are not found in cookies");
    }

    const decodeToken = jwt.verify(
      token,
      env.ACCESS_TOKEN_KEY,
    ) as jwt.JwtPayload;

    if (!decodeToken) {
      throw new ApiError(401, "ERROR: Unauthorised user");
    }

    const user = await prisma.user.findUnique({
      where: { id: decodeToken?.id },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(
      new ApiError(
        403,
        "ERROR: Permission denied, You don't have permit to access",
      ),
    );
  }
};

export default authVerifyJwt;
