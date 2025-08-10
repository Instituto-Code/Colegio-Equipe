import express from 'express';
const router = express.Router();

//Rotas
import userRouter from './userRoutes.js';
import coordenadorRouter from './coordenadorRoutes.js';
import professorRouter from './professorRoutes.js';
import paisRouter from './paisRoutes.js';
import adminRouter from './AdminRoutes.js';

//Config. pré-fixo de rotas
router.use('/api/users', userRouter);
router.use('/api/coordenador', coordenadorRouter);
router.use('/api/professor', professorRouter);
router.use('/api/pais', paisRouter);
router.use('/api/admin', adminRouter);

export default router;
