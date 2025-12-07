import express from 'express';
const userRouter = express.Router();

//Rotas
import {
  getCurentUser,
  login,
  register,
  updateUser,
  resetPassMail,
  resetPass,
} from '../controllers/UserController.js';

//Middlewares
import { authGuard } from '../middlewares/authGuard.js';
import { validate } from '../middlewares/handleValidations.js';
import { userValidations } from '../middlewares/userValidations.js';
import { userLoginValidations } from '../middlewares/userValidations.js';

//Criação de endpoint com as proteções
userRouter.post('/register', userValidations(), validate, register);
userRouter.post('/login', userLoginValidations(), validate, login);
userRouter.get('/profile', authGuard, getCurentUser);
userRouter.patch('/updateUser', authGuard, validate, updateUser);
userRouter.post('/send-reset', resetPassMail);
userRouter.patch('/reset-pass/:token', resetPass);

export default userRouter;
