import express from "express"
const userRouter = express.Router()


//Rotas
import { register } from "../controllers/UserController.mjs"

//Middlewares
import { authGuard } from "../middlewares/authGuard.mjs"
import { validate } from "../middlewares/handleValidations.mjs"
import { userValidations } from "../middlewares/userValidations.mjs"

//Criação de endpoint com as proteções
userRouter.post("/register", userValidations(), validate, register)

export default userRouter