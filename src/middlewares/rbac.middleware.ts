import { NextFunction, Response } from "express";
import { ApiError } from "../utils";
import { IRequestUser } from "../types/auth.type";
import prisma from "../db/db";

const roleBasedAccessControl = (roles: string[] = []) => async (req: IRequestUser, res: Response, next: NextFunction) => {
    try {

        if (!req.user || !req.user.id) {
            throw new ApiError(404, "Requested userId not found")
        }

        const id = req?.user?.id

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            throw new ApiError(404, "user not found")
        }

        if (!roles.includes(user?.role)) {
            throw new ApiError(403, "ERROR: You don't have permission")
        }

        next()

    } catch (error) {
        next(new ApiError(403,
            "ERROR: ACCESS DENIED, You don't have permission to access this context"
        ))
    }
}

export default roleBasedAccessControl