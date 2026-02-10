import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import { insertAttendance, insertGrades, notes } from "./teacher.controller.js";
import { listClasses } from "../../controllers/CoordenadorController/DataDashboard.js";
const TeacherRouter = Router();


TeacherRouter.patch(
  '/insert-grades',
  authGuard,
  authorizeRole(['professor']),
  insertGrades,
);

TeacherRouter.patch(
  '/insert-attendance',
  authGuard,
  authorizeRole(['professor']),
  insertAttendance,
);

TeacherRouter.get(
  '/list-classes',
  authGuard,
  authorizeRole(['professor']),
  listClasses,
);

TeacherRouter.patch('/notes', authGuard, authorizeRole(['professor']), notes);


export default TeacherRouter;