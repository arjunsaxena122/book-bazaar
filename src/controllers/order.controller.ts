import { Response } from "express";
import { IRequestUser } from "../types/auth.type";
import { ApiError, ApiResponse } from "../utils";
import prisma from "../db/db";
import { IOrder } from "../types/order.type";

export const userBookPlaceOrder = async (req: IRequestUser, res: Response) => {

    const { ship_to, payment_method, total_amount, grand_total_amount, order_item }: IOrder = req.body

    if (!ship_to || !payment_method || !total_amount || !grand_total_amount || !order_item) {
        throw new ApiError(404, "Please fill all the required fields")
    }

    if (!req.user || !req?.user?.id) {
        throw new ApiError(404, "Requested userId not found")
    }

    const placeOrderByUser = await prisma.order.create({
        data: {
            ship_to,
            payment_method,
            total_amount,
            grand_total_amount,
            userId: String(req?.user?.id),
            order_item: {
                create: order_item.map((item) => ({
                    bookId: item.bookId,
                    book_quantity: item.book_quantity,
                    book_price: item.book_price
                }))
            }
        }
    })

    const isPlaceOrderCreateInDB = await prisma.order.findUnique({
        where: {
            id: String(placeOrderByUser?.id)
        }
    })

    if (!isPlaceOrderCreateInDB) {
        throw new ApiError(500, "Internal server error, An order is not placed yet, Please try again to order")
    }

    return new ApiResponse(201, "Your order place succesfully", isPlaceOrderCreateInDB)

}

export const getUserAllListOfOrder = async (req: IRequestUser, res: Response) => {
    if (!req.user || !req.user.id) {
        throw new ApiError(404, "Requested userId not found")
    }

    const userId: string = req?.user?.id

    const allOrderByUser = await prisma.order.findFirst({
        where: {
            userId: String(userId)
        },
        include: {
            user: true
        }
    })

    if (!allOrderByUser) {
        throw new ApiError(404, "No order yet!")
    }

    return new ApiResponse(200, "Fetched all order", allOrderByUser)

}

export const getOrderDetailById = async (req: IRequestUser, res: Response) => {
    const { orderId } = req.params

    if (!orderId) {
        throw new ApiError(404, "Requested orderId not found")
    }

    const order = await prisma.order.findUnique({
        where: {
            id: String(orderId)
        },
        include: {
            order_item: true
        }
    })

    if (!order) {
        throw new ApiError(404, "No order found")
    }

    return new ApiResponse(200, `Get your order detail`, order)

}