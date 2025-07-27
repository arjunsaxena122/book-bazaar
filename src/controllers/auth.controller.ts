import { Request, Response } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../utils";
import prisma from "../db/db";
import { hashedPassword } from "../helper/auth.helper";

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

const login = asyncHandler(async (req: Request, res: Response) => {});

const logout = asyncHandler(async (req: Request, res: Response) => {});

const getMe = asyncHandler(async (req: Request, res: Response) => {});

const generateNewToken = asyncHandler(
  async (req: Request, res: Response) => {},
);

export { register, login, logout, getMe, generateNewToken };
