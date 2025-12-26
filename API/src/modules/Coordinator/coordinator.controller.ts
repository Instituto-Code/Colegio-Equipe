import Logger from "../../../config/logger.js";
import { CustomRequest } from "../../middlewares/authGuard.js";
import { Response } from "express";
import { RegisterClassesService, RegisterStudentService } from "./services/coordinatorAction.service.js";

//Cadastrar as turmas
export const registerClasses = async (req: CustomRequest, res: Response) => {
  const { nome, turno, anoLetivo } = req.body;

  try {
    
    const data = {
      nome,
      turno,
      anoLetivo
    }

    const result = await RegisterClassesService(data);

    res.status(201).json(result);
    
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Cadastrando alunos
export const registerStudent = async (req: CustomRequest, res: Response) => {
  const { nome, matricula, dataNasc, sexo, cpf } = req.body;

  try {
    
    const data = {
      nome,
      matricula,
      dataNasc,
      sexo,
      cpf
    }

    const result = await RegisterStudentService(data);

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};