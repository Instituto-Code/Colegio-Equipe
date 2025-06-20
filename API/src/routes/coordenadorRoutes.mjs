import express from "express";
const coordenadorRouter = express.Router();

//Middlewares
import { authGuard } from "../middlewares/authGuard.mjs";
import { authorizeRole } from "../middlewares/authorizeRole.mjs";

//Rotas
import { registerClasses } from "../controllers/CoordenadorController.mjs";
import { registerStudent } from "../controllers/CoordenadorController.mjs";
import { registerTeacher } from "../controllers/CoordenadorController.mjs";

//Configurações de rotas
coordenadorRouter.post('/register-classes', authGuard, authorizeRole("Coordenador"), registerClasses);

coordenadorRouter.post('/register-students', authGuard, authorizeRole("Coordenador"), registerStudent);

coordenadorRouter.post('/register-teacher', authGuard, authorizeRole("Coordenador"), registerTeacher);


export default coordenadorRouter;