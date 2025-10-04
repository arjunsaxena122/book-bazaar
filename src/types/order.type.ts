import { Decimal } from "@prisma/client/runtime/library"
import { Payment_Method } from "../generated/prisma"

export interface IOrder {
    ship_to: string
    payment_method: Payment_Method
    total_amount: Decimal
    grand_total_amount: Decimal,
    order_item: IOrderItem[]
}

interface IOrderItem {
    bookId: string,
    book_quantity: number,
    book_price: Decimal
}