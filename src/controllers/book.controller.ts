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

export const updateBookByAdmin = async (req: IRequestUser, res: Response) => {
    const { bookId } = req.params

    if (!bookId) {
        throw new ApiError(404, "requested bookID not found")
    }

    const book = await prisma.book.findUnique({
        where: {
            id: String(bookId)
        }
    })

    if (!book) {
        throw new ApiError(404, "Your requested book is not found")
    }

    const { book_title, book_description, book_price, book_publish_date, book_language, book_publisher, book_pages, book_rating, book_category, book_author_name }: IBookType = req.body

    if ([book_title, book_description, book_price, book_publish_date, book_language, book_publisher, book_pages, book_rating, book_category, book_author_name].some(f => f === "")) {
        throw new ApiError(400, "Please fill all the required fields")
    }

    if (!req.user || !req.user.id) {
        throw new ApiError(404, "requested userId not found")
    }

    const updatedBook = await prisma.book.update({
        where: {
            id: String(book.id)
        },
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

    if (!updatedBook) {
        throw new ApiError(500, "Internal server error, Please try again to update details.")
    }


    return new ApiResponse(200, `your ${book.book_title} book is update successfully`, updatedBook)
}

export const removeBookByAdmin = async (req: IRequestUser, res: Response) => {
    const { bookId } = req.params

    if (!bookId) {
        throw new ApiError(404, "requested book id not found")
    }

    const book = await prisma.book.findUnique({
        where: {
            id: String(bookId)
        }
    })

    if (!book) {
        throw new ApiError(404, "Your requested book is not found")
    }

    const deletedBook = await prisma.book.delete({
        where: {
            id: String(bookId)
        }
    })

    if (!deletedBook) {
        throw new ApiError(500, "Internal server error, Please try again to remove book")
    }

    return new ApiResponse(200, `your ${book.book_title} book is remove successfully`, deletedBook)

}

export const getAllBooks = async (req: IRequestUser, res: Response) => {

    const book = await prisma.book.findMany()

    if (!book) {
        throw new ApiError(404, "No book available")
    }

    return new ApiResponse(200, "all books fetched successfully", book)
}

export const getBookById = async (req: IRequestUser, res: Response) => {
    const { bookId } = req.params

    if (!bookId) {
        throw new ApiError(404, "requested book id not found")
    }

    const book = await prisma.book.findUnique({
        where: {
            id: String(bookId)
        }
    })

    if (!book) {
        throw new ApiError(404, "Your requested book is not found")
    }

    return new ApiResponse(200, `your ${book.book_title} book is available`, book)

}

