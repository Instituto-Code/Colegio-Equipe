// controllers/closeBimestre.controller.ts

import { Response } from 'express';
import {
  CloseBimestreTurmaService,
  ReopenBimestreTurmaService,
} from './service/bimestre.service.js';
import Logger from '../../../config/logger.js';
import { CustomRequest } from '../../middlewares/authGuard.js';

function getBimestreRequest(req: CustomRequest) {
  const { turmaId, disciplinaId, bimestre, anoLetivo } = req.body;

  return {
    turmaId,
    disciplinaId,
    bimestre: Number(bimestre) as 1 | 2 | 3 | 4,
    anoLetivo: Number(anoLetivo),
    userId: req.user?._id,
    role: req.user?.role,
  };
}

function validateBimestreRequest(data: ReturnType<typeof getBimestreRequest>) {
  if (
    !data.turmaId ||
    !data.disciplinaId ||
    ![1, 2, 3, 4].includes(data.bimestre) ||
    !data.anoLetivo
  ) {
    return false;
  }

  return true;
}

export const closeBimestre = async (req: CustomRequest, res: Response) => {
  try {
    const data = getBimestreRequest(req);

    if (!validateBimestreRequest(data)) {
      return res.status(400).json({
        errors: ['Dados obrigatórios não informados.'],
      });
    }

    const result = await CloseBimestreTurmaService(data);

    return res.status(200).json(result);
  } catch (error: any) {
    Logger.error(`Erro ao fechar bimestre: ${error.message}`);

    return res.status(400).json({
      errors: [error.message || 'Erro ao fechar bimestre.'],
    });
  }
};

export const reopenBimestre = async (req: CustomRequest, res: Response) => {
  try {
    const data = getBimestreRequest(req);

    if (!validateBimestreRequest(data)) {
      return res.status(400).json({
        errors: ['Dados obrigatórios não informados.'],
      });
    }

    const result = await ReopenBimestreTurmaService(data);

    return res.status(200).json(result);
  } catch (error: any) {
    Logger.error(`Erro ao reabrir bimestre: ${error.message}`);

    return res.status(400).json({
      errors: [error.message || 'Erro ao reabrir bimestre.'],
    });
  }
};
