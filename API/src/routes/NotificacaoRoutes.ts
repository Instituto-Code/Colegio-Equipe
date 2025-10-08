import express from "express";
const noteRouter = express.Router();


import { createNote } from "../controllers/NotificacaoController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

noteRouter.post("/create-note", authGuard, authorizeRole('coordenador'), createNote);


export default noteRouter;