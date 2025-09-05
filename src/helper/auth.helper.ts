import bcrypt from "bcryptjs";
import { ApiError } from "../utils";
import jwt from "jsonwebtoken";
import prisma from "../db/db";
import { env } from "../config/config";
import { Request } from "express";
import { User } from "../generated/prisma";

const hashedPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const isCheckPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generatingAccessAndRefreshToken = async (
  id: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  if (!id) {
    throw new ApiError(404, "userId not found");
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentional");
  }

  const accessToken = jwt.sign({ id: user?.id }, env?.ACCESS_TOKEN_KEY, {
    expiresIn: env?.ACCESS_TOKEN_KEY_EXPIRY as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign({ id: user?.id }, env?.REFRESH_TOKEN_KEY, {
    expiresIn: env?.REFRESH_TOKEN_KEY_EXPIRY as jwt.SignOptions["expiresIn"],
  });

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "failed to generate tokens!");
  }

  return { accessToken, refreshToken };
};

type TPickRequestUser = Pick<User, "id" | "email" | "role" | "isEmailVerified">;

export interface IRequestUser extends Request {
  user?: TPickRequestUser;
}

export { hashedPassword, isCheckPassword, generatingAccessAndRefreshToken };
