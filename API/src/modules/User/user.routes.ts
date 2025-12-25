import Router from "express";
import { userLoginValidations, userValidations } from "../../middlewares/userValidations.js";
import { validate } from "../../middlewares/handleValidations.js";
import { EditProfile, Login, Profile, Register } from "./user.controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
const userRouter = Router();


userRouter.post('/register', userValidations(), validate, Register);

userRouter.post('/login', userLoginValidations(), validate, Login);

userRouter.get('/profile', authGuard, Profile);

userRouter.patch("/edit-profile", authGuard, EditProfile);

export default userRouter;