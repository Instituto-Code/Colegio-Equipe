import Logger from "../../../config/logger.js";
import { CustomRequest } from "../../middlewares/authGuard.js";
import { Response } from "express";
import {
  DeleteGradeService,
  InsertAttendanceService,
  InsertGradeService,
  ListAttendanceService,
  NotesService,
  UpdateGradeService,
} from "./services/teacherAction.service.js";
import { ListClasses, ListDisciplines } from "./services/teacherList.service.js";

function sendTeacherError(res: Response, error: any) {
  const message = error?.message || 'Erro interno do servidor!';
  const status = /não encontrad/i.test(message)
    ? 404
    : /vínculo|pertence|leciona|permiss/i.test(message)
      ? 403
      : 400;

  Logger.error(`Erro na área do professor: ${message}`);

  return res.status(status).json({ errors: [message] });
}

//Funcionalidade de inserir notas
export const insertGrades = async (req: CustomRequest, res: Response) => {
  const { disciplinaId, studentId, bimestre, tipo, nota, data, date, anoLetivo } =
    req.body;

  try {
    const result = await InsertGradeService({
      userId: req.user._id,
      disciplinaId,
      studentId,
      tipo,
      bimestre,
      nota,
      data: data ?? date,
      anoLetivo: anoLetivo ? Number(anoLetivo) : undefined,
    });

    return res.status(201).json(result);
  } catch (error) {
    return sendTeacherError(res, error);
  }
};

//Funcionalidade de editar uma nota lançada
export const updateGrade = async (req: CustomRequest, res: Response) => {
  const { gradeId } = req.params;
  const { tipo, nota, data, bimestre } = req.body;

  try {
    const result = await UpdateGradeService({
      userId: req.user._id,
      gradeId,
      tipo,
      nota,
      data,
      bimestre,
    });

    return res.status(200).json(result);
  } catch (error) {
    return sendTeacherError(res, error);
  }
};

//Funcionalidade de excluir uma nota lançada
export const deleteGrade = async (req: CustomRequest, res: Response) => {
  const { gradeId } = req.params;

  try {
    const result = await DeleteGradeService({
      userId: req.user._id,
      gradeId,
    });

    return res.status(200).json(result);
  } catch (error) {
    return sendTeacherError(res, error);
  }
};

//Frequência da turma
export const insertAttendance = async (req: CustomRequest, res: Response) => {
  const { turmaId, disciplinaId, data, registros } = req.body;

  try {
    const result = await InsertAttendanceService({
      userId: req.user._id,
      turmaId,
      disciplinaId,
      data,
      registros,
    });

    return res.status(200).json(result);
  } catch (error) {
    return sendTeacherError(res, error);
  }
};

//Listagem de frequência de uma turma em uma data
export const listAttendance = async (req: CustomRequest, res: Response) => {
  const { turmaId, disciplinaId, data } = req.query;

  try {
    const result = await ListAttendanceService({
      userId: req.user._id,
      turmaId: String(turmaId ?? ''),
      disciplinaId: String(disciplinaId ?? ''),
      data: data ? String(data) : undefined,
    });

    return res.status(200).json(result);
  } catch (error) {
    return sendTeacherError(res, error);
  }
};

//Listagem de turmas em que o professor leciona
export const listClasses = async (req: CustomRequest, res: Response) => {
  try {
    const result = await ListClasses(req.user);

    return res.status(200).json(result);
  } catch (error) {
    return sendTeacherError(res, error);
  }
};

//Listagem de disciplinas que o professor leciona
export const listDisciplines = async (req: CustomRequest, res: Response) => {
  try {
    const result = await ListDisciplines(req.user);

    return res.status(200).json(result);
  } catch (error) {
    return sendTeacherError(res, error);
  }
};

//Funcionalidades de anotações sobre os alunos para os pais
export const notes = async (req: CustomRequest, res: Response) => {
  const { studentId, anotacao } = req.body;

  try {
    const result = await NotesService({
      userId: req.user._id,
      studentId,
      anotacao,
    });

    return res.status(201).json(result);
  } catch (error) {
    return sendTeacherError(res, error);
  }
};
