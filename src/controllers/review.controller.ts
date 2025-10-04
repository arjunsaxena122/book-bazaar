import { Response } from "express";
import { IRequestUser } from "../types/auth.type";
import { ApiError, ApiResponse } from "../utils";
import prisma from "../db/db";

export const addReviewByUser = async (req: IRequestUser, res: Response) => {
    const { bookId } = req.params
    const { book_review }: { book_review: string } = req.body

    if (!bookId) {
        throw new ApiError(404, "requested book id not found")
    }

    if (!req.user || !req.user.id) {
        throw new ApiError(404, "requested userId not found")
    }

    if (!book_review) {
        throw new ApiError(400, "Please write something for review")
    }

    const review = await prisma.review.create({
        data: {
            book_review,
            userId: String(req?.user?.id),
            bookId: String(bookId)
        }
    })

    const isReviewPostCreated = await prisma.review.findUnique({
        where: {
            id: review?.id
        }
    })

    if (!isReviewPostCreated) {
        throw new ApiError(500, "Internal server error, Please post again your review")
    }

    return new ApiResponse(201, "Your review post successfully created", isReviewPostCreated)


}

export const listAllReviewForBook = async (req: IRequestUser, res: Response) => {
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
        throw new ApiError(404, "No book available")
    }

    const findAllReviewForBook = await prisma.review.findFirst({
        where: {
            bookId: String(bookId)
        }
    })

    if (!findAllReviewForBook) {
        throw new ApiError(404, "This book don't have reviews")
    }

    return new ApiResponse(200, "fetched all review for this book", findAllReviewForBook)

}

export const removeReviewByAdmin = async (req: IRequestUser, res: Response) => {
    const { reviewId } = req.params

    if (!reviewId) {
        throw new ApiError(404, "requested reviewId not found")
    }

    const isReviewExist = await prisma.review.findUnique({
        where: {
            id: reviewId
        }
    })

    if (!isReviewExist) {
        throw new ApiError(404, "Review not found")
    }

    const deleteReviewFromDB = await prisma.review.delete({
        where: {
            id: isReviewExist?.id
        }
    })

    if (!deleteReviewFromDB) {
        throw new ApiError(500, "Internal server error, Please remove review again")
    }

    return new ApiResponse(200, "Review remove successfully", deleteReviewFromDB)

}