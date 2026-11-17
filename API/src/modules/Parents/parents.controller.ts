import Logger from "../../../config/logger.js";
import { CustomRequest } from "../../middlewares/authGuard.js";
import {
  getChildDetailsService,
  listChildrensService,
} from "./services/parentList.service.js";
import { Response } from "express";

function getErrorStatus(message: string) {
  if (message.includes("ID do aluno inválido")) return 400;
  if (message.includes("não vinculado")) return 403;
  if (message.includes("não encontrado")) return 404;

  return 500;
}

//Listar filhos
export const listChildrens = async (req: CustomRequest, res: Response) => {
  const user = req.user;

  try {
    const result = await listChildrensService(user);

    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor!";
    const status = getErrorStatus(message);

    res.status(status).json({
      errors: status === 500 ? ["Erro interno do servidor!"] : [message],
    });
    Logger.error(`Erro ao listar filhos do responsável: ${error}`);
  }
};

//Listar dados de um filho
export const getChildDetails = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  const { studentId } = req.params;

  try {
    const result = await getChildDetailsService(user, studentId);

    res.status(200).json({ aluno: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor!";
    const status = getErrorStatus(message);

    res.status(status).json({
      errors: status === 500 ? ["Erro interno do servidor!"] : [message],
    });
    Logger.error(`Erro ao buscar aluno do responsável: ${error}`);
  }
};
