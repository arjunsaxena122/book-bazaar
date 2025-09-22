import { Request } from "express";
import { User } from "../generated/prisma";

type TPickRequestUser = Pick<User, "id" | "email" | "role" | "isEmailVerified">;

export interface IRequestUser extends Request {
    user?: TPickRequestUser;
}