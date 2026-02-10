import Logger from "../../../config/logger.js";
import { CustomRequest } from "../../middlewares/authGuard.js";
import { InsertAttendanceService, InsertGradeService, NotesService } from "./services/teacherAction.service.js";
import { Response } from "express";
import { ListClasses } from "./services/teacherList.service.js";

//Funcionalidade de inserir notas
export const insertGrades = async (req: CustomRequest, res: Response) => {

  const { disciplinaId, studentId, bimestre, tipo, nota, data } = req.body;

  const userId = req.user._id;

  try {

    const dataRequest = {
      userId,
      disciplinaId,
      studentId,
      tipo,
      bimestre,
      nota,
      data
    }

    const result = await InsertGradeService(dataRequest);

    res.status(201).json(result);

  }

  catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Frequencia para o aluno
export const insertAttendance = async (req: CustomRequest, res: Response) => {
  const { studentId, tipo, data } = req.body;
  const userId = req.user._id;

  try {

    const dataRequest = {
      userId,
      studentId,
      tipo, 
      data
    }

    const result = InsertAttendanceService(dataRequest)

    res.status(201).json(result);
    
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listagem de turmas em que o professor leciona
export const listClasses = async (req: CustomRequest, res: Response) => {
  try {
    //Pegando id do usuário logado
    const user = req.user;

    const result = await ListClasses(user);

    res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Funcionalidades de anotações sobre os alunos para os pais
export const notes = async (req: CustomRequest, res: Response) => {
  const { studentId, anotacao } = req.body;

  const userId = req.user._id;
  try {

    const data = {
      userId,
      studentId,
      anotacao
    }

    const result = await NotesService(data);

    res.status(201).json(result);
    
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};