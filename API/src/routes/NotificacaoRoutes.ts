import express from "express";
const noteRouter = express.Router();


import { createNote, deleteNote, updateNote, listNotesGroup, viewNotes, listNotesByUser, listAllNotes } from "../controllers/NotificacaoController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

noteRouter.post("/create-note", authGuard, authorizeRole('coordenador'), createNote);
noteRouter.delete("/delete-note/:id", authGuard, authorizeRole('coordenador'), deleteNote);
noteRouter.patch("/update-note/:id", authGuard, authorizeRole('coordenador'), updateNote);
noteRouter.get('/list-note-groups', authGuard, listNotesGroup);
noteRouter.patch('/view/:noteId', authGuard, viewNotes);
noteRouter.get('/list-note-user/:userId', authGuard, listNotesByUser);
noteRouter.get('/list-all-notes', authGuard, authorizeRole('coordenador'), listAllNotes);

export default noteRouter;