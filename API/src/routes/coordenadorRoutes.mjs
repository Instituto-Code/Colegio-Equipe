import express from "express";
const coordenadorRouter = express.Router();

//Middlewares
import { authGuard } from "../middlewares/authGuard.mjs";
import { authorizeRole } from "../middlewares/authorizeRole.mjs";

//Rotas
import { 
    registerClasses ,
    registerStudent,
    registerTeacher,
    registerDisciplines,
    classToTeacher,
    disciplineToTeacher,
    disciplineToClass,
    studentToClass

} from "../controllers/CoordenadorController.mjs";


//Configurações de rotas
coordenadorRouter.post('/register-classes', authGuard, authorizeRole("coordenador"), registerClasses);
coordenadorRouter.post('/register-students', authGuard, authorizeRole("coordenador"), registerStudent);
coordenadorRouter.post('/register-teacher', authGuard, authorizeRole("coordenador"), registerTeacher);
coordenadorRouter.post('/register-discipline', authGuard, authorizeRole("coordenador"), registerDisciplines);
coordenadorRouter.patch('/classToTeacher', authGuard, authorizeRole("coordenador"), classToTeacher);
coordenadorRouter.patch('/disciplineToTeacher', authGuard, authorizeRole("coordenador"), disciplineToTeacher);
coordenadorRouter.patch('/disciplineToClass', authGuard, authorizeRole("coordenador"), disciplineToClass);
coordenadorRouter.patch('/studentToClass', authGuard, authorizeRole("coordenador"), studentToClass);


export default coordenadorRouter;