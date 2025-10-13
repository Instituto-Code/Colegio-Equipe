import express from 'express';
const coordenadorRouter = express.Router();

//Middlewares
import { authGuard } from '../middlewares/authGuard.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

//Rotas
import {
  registerClasses,
  registerStudent,
  registerTeacher,
  registerDisciplines,
  classToTeacher,
  disciplineToTeacher,
  disciplineToClass,
  studentToClass,
  registerParents,
  studentToParent,
} from '../controllers/CoordenadorController.js';
import { listEvents, registerEvent } from '../controllers/EventController.js';

//Configurações de rotas
coordenadorRouter.post(
  '/register-classes',
  authGuard,
  authorizeRole('coordenador'),
  registerClasses,
);
coordenadorRouter.post(
  '/register-students',
  authGuard,
  authorizeRole('coordenador'),
  registerStudent,
);
coordenadorRouter.post(
  '/register-teacher',
  authGuard,
  authorizeRole('coordenador'),
  registerTeacher,
);
coordenadorRouter.post(
  '/register-discipline',
  authGuard,
  authorizeRole('coordenador'),
  registerDisciplines,
);
coordenadorRouter.patch(
  '/classToTeacher',
  authGuard,
  authorizeRole('coordenador'),
  classToTeacher,
);
coordenadorRouter.patch(
  '/disciplineToTeacher',
  authGuard,
  authorizeRole('coordenador'),
  disciplineToTeacher,
);
coordenadorRouter.patch(
  '/disciplineToClass',
  authGuard,
  authorizeRole('coordenador'),
  disciplineToClass,
);
coordenadorRouter.patch(
  '/studentToClass',
  authGuard,
  authorizeRole('coordenador'),
  studentToClass,
);
coordenadorRouter.patch(
  '/register-parent',
  authGuard,
  authorizeRole('coordenador'),
  registerParents,
);
coordenadorRouter.patch(
  '/studentToParent',
  authGuard,
  authorizeRole('coordenador'),
  studentToParent,
);
coordenadorRouter.post(
  '/create-event',
  authGuard,
  authorizeRole('coordenador'),
  registerEvent
);
coordenadorRouter.get(
  '/list-events',
  authGuard,
  listEvents
);

export default coordenadorRouter;
