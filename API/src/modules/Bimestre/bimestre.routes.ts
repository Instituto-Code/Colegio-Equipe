// routes/grade.routes.ts

import { Router } from 'express';
import { closeBimestre, reopenBimestre } from './bimestre.controller.js';
import { authGuard } from '../../middlewares/authGuard.js';
import { authorizeRole } from '../../middlewares/authorizeRole.js';

const bimestreRouter = Router();

bimestreRouter.post(
  '/close-bimestre',
  authGuard,
  authorizeRole(['admin', 'professor']),
  closeBimestre
);

bimestreRouter.post(
  '/reopen-bimestre',
  authGuard,
  authorizeRole(['admin', 'professor']),
  reopenBimestre
);

export default bimestreRouter;
