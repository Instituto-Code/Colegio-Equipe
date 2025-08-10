import express from 'express';
const adminRouter = express.Router();

//Middlewares
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { authGuard } from '../middlewares/authGuard.js';
import { modifyDataUser } from '../controllers/AdminController.js';

adminRouter.patch(
  '/modify-data-user',
  authGuard,
  authorizeRole('admin'),
  modifyDataUser,
);

export default adminRouter;
