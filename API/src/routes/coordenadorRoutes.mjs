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
coordenadorRouter.post('/register-classes', authGuard, authorizeRole("Coordenador"), registerClasses);
coordenadorRouter.post('/register-students', authGuard, authorizeRole("Coordenador"), registerStudent);
coordenadorRouter.post('/register-teacher', authGuard, authorizeRole("Coordenador"), registerTeacher);
coordenadorRouter.post('/register-discipline', authGuard, authorizeRole("Coordenador"), registerDisciplines);
coordenadorRouter.put('/classToTeacher', authGuard, authorizeRole("Coordenador"), classToTeacher);
coordenadorRouter.put('/disciplineToTeacher', authGuard, authorizeRole("Coordenador"), disciplineToTeacher);
coordenadorRouter.put('/disciplineToClass', authGuard, authorizeRole("Coordenador"), disciplineToClass);
coordenadorRouter.put('/studentToClass', authGuard, authorizeRole("Coordenador"), studentToClass);


export default coordenadorRouter;