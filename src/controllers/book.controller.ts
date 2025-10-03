import { Response } from "express";
import { IRequestUser } from "../types/auth.type";
import { ApiError, ApiResponse } from "../utils";
import prisma from "../db/db";
import { IBookType } from "../types/book.type";

export const addBooksByAdmin = async (req: IRequestUser, res: Response) => {
    const { book_title, book_description, book_price, book_publish_date, book_language, book_publisher, book_pages, book_rating, book_category, book_author_name }: IBookType = req.body

    if ([book_title, book_description, book_price, book_publish_date, book_language, book_publisher, book_pages, book_rating, book_category, book_author_name].some(f => f === "")) {
        throw new ApiError(400, "Please fill all the required fields")
    }

    if (!req.user || !req.user.id) {
        throw new ApiError(404, "requested userId not found")
    }

    const existingBook = await prisma.book.findUnique({
        where: {
            book_title
        }
    })

    if (existingBook) {
        throw new ApiError(409, "This book already exist, Please try new one!")
    }

    const book = await prisma.book.create({
        data: {
            book_title,
            book_description,
            book_price,
            book_publish_date,
            book_language,
            book_publisher,
            book_pages,
            book_rating,
            book_category,
            book_author_name,
            userId: req.user.id
        }
    })

    const isBookAdd = await prisma.book.findUnique({
        where: {
            id: book?.id
        }
    })

    if (!isBookAdd) {
        throw new ApiError(500, "Internal server error, your book is not adding yet, Please try again to add book")
    }

    return new ApiResponse(201, `${book_title} book is add successfully`)
}