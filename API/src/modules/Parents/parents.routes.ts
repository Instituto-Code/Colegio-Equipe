import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard.js";
import { listChildrens } from "./parents.controller.js";
const parentsRouter = Router();


//config. rotas
parentsRouter.get('/list-childrens', authGuard, listChildrens);


export default parentsRouter;