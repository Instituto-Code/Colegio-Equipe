import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import {
  deleteGrade,
  insertAttendance,
  insertGrades,
  listAttendance,
  listClasses,
  listDisciplines,
  notes,
  updateGrade,
} from "./teacher.controller.js";

const TeacherRouter = Router();

TeacherRouter.patch(
  '/insert-grades',
  authGuard,
  authorizeRole(['professor']),
  insertGrades,
);

TeacherRouter.patch(
  '/update-grades/:gradeId',
  authGuard,
  authorizeRole(['professor']),
  updateGrade,
);

TeacherRouter.delete(
  '/delete-grades/:gradeId',
  authGuard,
  authorizeRole(['professor']),
  deleteGrade,
);

TeacherRouter.patch(
  '/insert-attendance',
  authGuard,
  authorizeRole(['professor']),
  insertAttendance,
);

TeacherRouter.get(
  '/list-attendance',
  authGuard,
  authorizeRole(['professor']),
  listAttendance,
);

TeacherRouter.get(
  '/list-classes',
  authGuard,
  authorizeRole(['professor']),
  listClasses,
);

TeacherRouter.get(
  '/list-disciplines',
  authGuard,
  authorizeRole(['professor']),
  listDisciplines,
);

TeacherRouter.patch('/notes', authGuard, authorizeRole(['professor']), notes);

export default TeacherRouter;
