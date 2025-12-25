import { CustomRequest } from "../../middlewares/authGuard.js";
import { Response } from "express";
import { ModifyDataUserService } from "./services/adminAction.service.js";
import Logger from "../../../config/logger.js";

export const modifyDataUser = async (req: CustomRequest, res: Response) => {
  const { userId, role } = req.body;
  const adminId = req.user._id;

  try {
    
    const data = {
      role
    }
    const result = await ModifyDataUserService(adminId, userId, data);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({
      errors: ['Erro interno do servidor!'],
    });
    Logger.error(`Erro interno do servidor: ${err}`);
  }
};
