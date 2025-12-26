import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard.js";
import { createNote, deleteNote, listAllNotes, listNotesByUser, listNotesGroup, updateNote, viewNotes } from "./notification.controller.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
const notificationRouter = Router();


notificationRouter.post("/create-note", authGuard, authorizeRole('coordenador'), createNote);

notificationRouter.delete("/delete-note/:id", authGuard, authorizeRole('coordenador'), deleteNote);

notificationRouter.patch("/update-note/:id", authGuard, authorizeRole('coordenador'), updateNote);

notificationRouter.get('/list-note-groups', authGuard, listNotesGroup);

notificationRouter.patch('/view/:noteId', authGuard, viewNotes);

notificationRouter.get("/list-note/:userId/user", authGuard, listNotesByUser);

notificationRouter.get("/list-all/notifications", authGuard, listAllNotes);


export default notificationRouter;