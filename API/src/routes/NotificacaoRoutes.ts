import express from "express";
const noteRouter = express.Router();


import { createNote, deleteNote, updateNote, listNotesGroup, listNotesByUser } from "../controllers/NotificacaoController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

noteRouter.post("/create-note", authGuard, authorizeRole('coordenador'), createNote);
noteRouter.delete("/delete-note/:id", authGuard, authorizeRole('coordenador'), deleteNote);
noteRouter.patch("/update-note/:id", authGuard, authorizeRole('coordenador'), updateNote);
noteRouter.get('/list-note-groups', authGuard, listNotesGroup);
noteRouter.get('/list-note-user/:id', authGuard, authorizeRole('coordenador'), listNotesByUser);

export default noteRouter;