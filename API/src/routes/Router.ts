import express from 'express';
const router = express.Router();

//Rotas
import userRouter from '../modules/User/user.routes.js';
import coordenadorRouter from './coordenadorRoutes.js';
import adminRouter from './AdminRoutes.js';
import TeacherRouter from '../modules/Teacher/teacher.routes.js';
import parentsRouter from '../modules/Parents/parents.routes.js';
import notificationRouter from '../modules/Notification/notification.routes.js';

//Config. pré-fixo de rotas
router.use('/api/users', userRouter);
router.use('/api/coordenador', coordenadorRouter);
router.use('/api/teacher', TeacherRouter);
router.use('/api/parents', parentsRouter);
router.use('/api/admin', adminRouter);
router.use('/api/note', notificationRouter);

export default router;
