import { Router } from "express";
import { addBooksByAdmin } from "../controllers/book.controller";
import rbac from "../middlewares/rbac.middleware";
import { EnumRoleBased } from "../constants/constant";

const router: Router = Router()

router.route("/add-books").post(rbac([EnumRoleBased.ADMIN]), addBooksByAdmin)

export default router