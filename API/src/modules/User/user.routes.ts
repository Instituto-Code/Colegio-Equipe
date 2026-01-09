import Router from "express";
import { userLoginValidations, userValidations } from "../../middlewares/userValidations.js";
import { validate } from "../../middlewares/handleValidations.js";
import { EditProfile, Login, PhotoProfileController, Profile, Register, ResetPasswordController, SendMailResetController } from "./user.controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { upload } from "../../services/cloud/multer.js";
const userRouter = Router();


userRouter.post('/register', userValidations(), validate, Register);

userRouter.post('/login', userLoginValidations(), validate, Login);

userRouter.get('/profile', authGuard, Profile);

userRouter.patch("/edit-profile", authGuard, EditProfile);

userRouter.patch("/avatar", authGuard, upload.single("avatar"), PhotoProfileController);

userRouter.post('/auth/forgot-password', SendMailResetController);

userRouter.post("/auth/reset-password", ResetPasswordController);

export default userRouter;