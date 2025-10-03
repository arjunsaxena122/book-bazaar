import { Decimal } from "@prisma/client/runtime/library";
import { Category } from "../generated/prisma";


export interface IBookType {
    book_title: string,
    book_description: string,
    book_price: Decimal,
    book_publish_date: Date,
    book_language: string,
    book_publisher?: string,
    book_pages: string,
    book_rating: number,
    book_category: Category,
    book_author_name: string,
}