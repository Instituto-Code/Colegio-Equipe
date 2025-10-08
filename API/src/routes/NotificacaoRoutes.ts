import express from "express";
const noteRouter = express.Router();


import { createNote, deleteNote, updateNote } from "../controllers/NotificacaoController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

noteRouter.post("/create-note", authGuard, authorizeRole('coordenador'), createNote);
noteRouter.delete("/delete-note", authGuard, authorizeRole('coordenador'), deleteNote);
noteRouter.patch("/update-note", authGuard, authorizeRole('coordenador'), updateNote);

export default noteRouter;