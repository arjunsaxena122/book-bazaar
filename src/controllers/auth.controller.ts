import { Request, Response } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../utils";
import prisma from "../db/db";
import {
  generatingAccessAndRefreshToken,
  hashedPassword,
  IRequestUser,
  isCheckPassword,
} from "../helper/auth.helper";
import { env } from "../config/config";

const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please fill the all required fields");
  }

  const existedUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existedUser) {
    throw new ApiError(409, "user already register, Please login!");
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: await hashedPassword(password),
    },
  });

  const loggedInUser = await prisma.user.findUnique({
    where: { id: user?.id },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
    },
  });

  if (!loggedInUser) {
    throw new ApiError(500, "Internal server error, Please try again");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "user register successfully", loggedInUser));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please fill the all required fields");
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentional, Please registered!");
  }

  const isPasswordValid = await isCheckPassword(password, user?.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentional");
  }

  const { accessToken, refreshToken } = await generatingAccessAndRefreshToken(
    user?.id,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "failed to generate tokens!");
  }

  const accessOptions = {
    httpOnly: true,
    secure: env.NODE_ENV !== "production" ? false : true,
    maxAge: 1000 * 60 * 60 * 24,
  };

  const refreshOptions = {
    httpOnly: true,
    secure: env.NODE_ENV !== "production" ? false : true,
    maxAge: 1000 * 60 * 60 * 24,
  };

  const updatedUser = await prisma.user.update({
    where: { id: user?.id },
    data: { refreshToken },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
    },
  });

  if (!updatedUser) {
    throw new ApiError(
      500,
      "Internal server error user refreshToken not updated, Please try again",
    );
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json(new ApiResponse(200, "login successfully", updatedUser));
});

const logout = asyncHandler(async (req: IRequestUser, res: Response) => {
  if (!req.user || !req.user?.id) {
    throw new ApiError(401, "ERROR: Unauthorised user, Request user not found");
  }

  const id = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(404, "User not exist");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { refreshToken: null },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
    },
  });

  if (!updatedUser) {
    throw new ApiError(
      500,
      "Internal server error user refreshToken not updated, Please try again",
    );
  }

  const accessOptions = {
    httpOnly: true,
    secure: env.NODE_ENV !== "production" ? false : true,
    expires: new Date(0),
  };

  const refreshOptions = {
    httpOnly: true,
    secure: env.NODE_ENV !== "production" ? false : true,
    expires: new Date(0),
  };

  return res
    .status(200)
    .clearCookie("accessToken", accessOptions)
    .clearCookie("refreshToken", refreshOptions)
    .json(new ApiResponse(200, "login successfully", updatedUser));
});

const getMe = asyncHandler(async (req: IRequestUser, res: Response) => {
  if (!req.user || !req.user?.id) {
    throw new ApiError(401, "ERROR: Unauthorised user, Request user not found");
  }

  const id = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, `${user?.email} data`, user));
});

const generateNewToken = asyncHandler(
  async (req: IRequestUser, res: Response) => {
    const IncomingRefreshToken = req?.cookies?.refreshToken;

    if (!IncomingRefreshToken) {
      throw new ApiError(401, "ERROR: Tokens aren't found, Please login!");
    }

    const user = await prisma.user.findUnique({
      where: { id: IncomingRefreshToken?.id },
      select: { id: true, refreshToken: true },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.refreshToken !== IncomingRefreshToken) {
      throw new ApiError(401, "ERROR: Unauthorsied user");
    }

    const { accessToken, refreshToken } = await generatingAccessAndRefreshToken(
      user?.id,
    );

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "failed to generate tokens!");
    }

    const accessOptions = {
      httpOnly: true,
      secure: env.NODE_ENV !== "production" ? false : true,
      maxAge: 1000 * 60 * 60 * 24,
    };

    const refreshOptions = {
      httpOnly: true,
      secure: env.NODE_ENV !== "production" ? false : true,
      maxAge: 1000 * 60 * 60 * 24,
    };

    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: { refreshToken },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
      },
    });

    if (!updatedUser) {
      throw new ApiError(
        500,
        "Internal server error user refreshToken not updated, Please try again",
      );
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessOptions)
      .cookie("refreshToken", refreshToken, refreshOptions)
      .json(
        new ApiResponse(200, "api key generated successfully", updatedUser),
      );
  },
);

export { register, login, logout, getMe, generateNewToken };
