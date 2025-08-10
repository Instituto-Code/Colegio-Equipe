import express from 'express';
const professorRouter = express.Router();

//Middlewares
import { authGuard } from '../middlewares/authGuard.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

//Rotas
import {
  insertGrades,
  insertAttendance,
  listClasses,
  listDisciplines,
  notes,
} from '../controllers/ProfessorController.js';

//Configurações de rotas
professorRouter.patch(
  '/insert-grades',
  authGuard,
  authorizeRole('professor'),
  insertGrades,
);
professorRouter.patch(
  '/insert-attendance',
  authGuard,
  authorizeRole('professor'),
  insertAttendance,
);
professorRouter.get(
  '/list-classes',
  authGuard,
  authorizeRole('professor'),
  listClasses,
);
professorRouter.get(
  '/list-disciplines',
  authGuard,
  authorizeRole('professor'),
  listDisciplines,
);
professorRouter.patch('/notes', authGuard, authorizeRole('professor'), notes);

export default professorRouter;
