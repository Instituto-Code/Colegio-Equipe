import Logger from "../../../config/logger.js";
import { CustomRequest } from "../../middlewares/authGuard.js";
import { Response } from "express";
import { DeleteUserService, RegisterClassesService, RegisterStudentService, RemoveStudentByClassService, RemoveTeacherByClassService, StudentByClassService } from "./services/coordinatorAction.service.js";

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

//Deletar um usuário
export const deleteUser = async (req: CustomRequest, res: Response) => {
  try{
    const { userId } = req.params;

    const result = await DeleteUserService(userId);

    res.status(200).json(result);
  }
  catch(error){
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
}

//Remover aluno de turma
export const removeStudentByClass = async (req: CustomRequest, res: Response) => {
  try{
    const { studentId } = req.params;
    const { className } = req.body;

    const result = await RemoveStudentByClassService(studentId, className);

    res.status(200).json(result);
  }
  catch(error){
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
}

// Remover professor de turma
export const removeTeacherByClass = async (req: CustomRequest, res: Response) => {
  try{
    const { teacherId } = req.params;
    const { className } = req.body;

    const result = await RemoveTeacherByClassService(teacherId, className);

    res.status(200).json(result);
  }catch(error){
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
}

export const GetStudentByClass = async (req: CustomRequest, res: Response) => {
  try{
  
    const result = await StudentByClassService();

    res.status(200).json(result);
  }
  catch(error){
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
}