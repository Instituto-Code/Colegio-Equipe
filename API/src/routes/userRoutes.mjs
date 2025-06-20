import express from "express"
const userRouter = express.Router()


//Rotas
import { 
    getCurentUser, 
    login, 
    register, 
    updateUser 
} from "../controllers/UserController.mjs"

//Middlewares
import { authGuard } from "../middlewares/authGuard.mjs"
import { validate } from "../middlewares/handleValidations.mjs"
import { userValidations } from "../middlewares/userValidations.mjs"
import { userLoginValidations } from "../middlewares/userValidations.mjs"
import { authorizeRole } from "../middlewares/authorizeRole.mjs"

//Criação de endpoint com as proteções
userRouter.post("/register", userValidations(), validate, register)
userRouter.post("/login", userLoginValidations(), validate, login)
userRouter.get("/profile", authGuard, getCurentUser)
userRouter.put("/updateUser", authGuard, validate, updateUser)

export default userRouter

