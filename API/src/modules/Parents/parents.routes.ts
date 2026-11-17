import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import {
  getChildDetails,
  listChildrens,
} from "./parents.controller.js";
const parentsRouter = Router();

//config. rotas
parentsRouter.get(
  "/list-childrens",
  authGuard,
  authorizeRole(["responsavel"]),
  listChildrens,
);

parentsRouter.get(
  "/child/:studentId",
  authGuard,
  authorizeRole(["responsavel"]),
  getChildDetails,
);

export default parentsRouter;
