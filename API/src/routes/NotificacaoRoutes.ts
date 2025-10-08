import express from "express";
const noteRouter = express.Router();


import { createNote } from "../controllers/NotificacaoController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { deleteNote } from "../controllers/NotificacaoController.js";

noteRouter.post("/create-note", authGuard, authorizeRole('coordenador'), createNote);
noteRouter.delete("/delete-note", authGuard, authorizeRole('coordenador'), deleteNote);


export default noteRouter;