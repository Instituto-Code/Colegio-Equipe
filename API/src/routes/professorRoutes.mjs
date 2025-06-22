import express from "express";
const professorRouter = express.Router();

//Middlewares
import { authGuard } from "../middlewares/authGuard.mjs";
import { authorizeRole } from "../middlewares/authorizeRole.mjs";

//Rotas
import { 
    insertGrades,
    insertAttendance,
    listClasses,
    listDisciplines

} from "../controllers/ProfessorController.mjs";

//Configurações de rotas
professorRouter.patch('/insert-grades', authGuard, authorizeRole("professor"), insertGrades);
professorRouter.patch('/insert-attendance', authGuard, authorizeRole("professor"), insertAttendance);
professorRouter.get('/list-classes', authGuard, authorizeRole("professor"), listClasses);
professorRouter.get('/list-disciplines', authGuard, authorizeRole("professor"), listDisciplines);

export default professorRouter;