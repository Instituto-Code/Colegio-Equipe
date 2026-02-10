import express from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { authorizeRole } from '../../middlewares/authorizeRole.js';
import { modifyDataUser } from './admin.controller.js';
const adminRouter = express.Router();


adminRouter.patch(
  '/modify-data-user',
  authGuard,
  authorizeRole(['admin']),
  modifyDataUser,
);

export default adminRouter;