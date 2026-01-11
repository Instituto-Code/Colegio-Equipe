import express from 'express';
const coordenadorRouter = express.Router();

//Middlewares
import { authGuard } from '../../middlewares/authGuard.js';
import { authorizeRole } from '../../middlewares/authorizeRole.js';
import { deleteUser, GetStudentByClass, registerClasses, registerStudent, removeStudentByClass } from './coordinator.controller.js';
import { classToTeacher, disciplineToClass, registerDisciplines, registerParents, registerTeacher, studentToClass, studentToParent } from '../../controllers/CoordenadorController/CoordenadorController.js';
import { ListAllEventsService } from '../Events/services/eventList.service.js';
import { getDashboardOverview, listClasses, listOneStudent, listOneTeacher, listParent, listParents, listStudents, listTeachers, listUsers } from '../../controllers/CoordenadorController/DataDashboard.js';
import { RegisterEventService } from '../Events/services/eventAction.service.js';
import { deleteStudents, editStudents } from '../../controllers/CoordenadorController/GerenceUsers.js';

//Rotas


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

coordenadorRouter.delete(
  '/delete/:userId/user',
  authGuard,
  authorizeRole('coordenador'),
  deleteUser
);

coordenadorRouter.patch(
  '/remove/:studentId/classroom',
  authGuard,
  authorizeRole('coordenador'),
  removeStudentByClass
)

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
  '/class/:classId/teacher/:teacherId',
  authGuard,
  authorizeRole('coordenador'),
  classToTeacher,
);

//Pode sair mais pra frente
coordenadorRouter.patch(
  '/disciplineToClass',
  authGuard,
  authorizeRole('coordenador'),
  disciplineToClass,
);

coordenadorRouter.patch(
  '/student/:studentId/class/:classId',
  authGuard,
  authorizeRole('coordenador'),
  studentToClass,
);

coordenadorRouter.patch(
  '/register-parent/:userId',
  authGuard,
  authorizeRole('coordenador'),
  registerParents,
);

coordenadorRouter.patch(
  '/student/:studentId/parent/:parentId',
  authGuard,
  authorizeRole('coordenador'),
  studentToParent,
);
coordenadorRouter.post(
  '/create-event',
  authGuard,
  authorizeRole('coordenador'),
  RegisterEventService,
);
coordenadorRouter.get('/list-events', authGuard, ListAllEventsService);

coordenadorRouter.get(
  '/getDashboardOverview',
  authGuard,
  authorizeRole('coordenador'),
  getDashboardOverview,
);

coordenadorRouter.get('/list-students', authGuard, listStudents);

coordenadorRouter.get('/list-student/:studentId', authGuard, listOneStudent);

coordenadorRouter.get(
  '/list-teachers',
  authGuard,
  authorizeRole('coordenador'),
  listTeachers,
);

coordenadorRouter.get(
  '/list-teacher/:teacherId',
  authGuard,
  authorizeRole('coordenador'),
  listOneTeacher,
);

coordenadorRouter.get(
  '/list-users',
  authGuard,
  authorizeRole('coordenador'),
  listUsers,
);

coordenadorRouter.get(
  '/list-turmas',
  authGuard,
  authorizeRole('coordenador'),
  listClasses,
);

coordenadorRouter.get(
  '/list-parents',
  authGuard,
  listParents
);

coordenadorRouter.get(
  '/list-parent/:parentId',
  authGuard,
  listParent
);

//Gerenciamento de usuário no geral
coordenadorRouter.delete(
  '/delete-student/:studentId',
  authGuard,
  authorizeRole('coordenador'),
  deleteStudents,
);

coordenadorRouter.patch(
  '/edit-student/:studentId',
  authGuard,
  authorizeRole('coordenador'),
  editStudents
)

coordenadorRouter.get(
  '/student-by-class',
  authGuard,
  authorizeRole('coordenador'),
  GetStudentByClass
)

export default coordenadorRouter;
