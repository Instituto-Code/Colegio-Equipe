import Logger from "../../../config/logger.js";
import { CustomRequest } from "../../middlewares/authGuard.js";
import { listChildrensService } from "./services/parentList.service.js";
import { Response } from "express";

//Listar filhos
export const listChildrens = async (req: CustomRequest, res: Response) => {
  const user = req.user;

  try {
   const result = await listChildrensService(user);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};
