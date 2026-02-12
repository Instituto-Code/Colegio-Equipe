// controllers/closeBimestre.controller.ts

import { Request, Response } from 'express';
import { CloseBimestreTurmaService } from './service/bimestre.service.js';
import Logger from '../../../config/logger.js';

export const closeBimestre = async (req: Request, res: Response) => {
  try {
    const { turmaId, disciplinaId, bimestre, anoLetivo } = req.body;

    if (!turmaId || !disciplinaId || !bimestre || !anoLetivo) {
      return res.status(400).json({
        errors: ['Dados obrigatórios não informados.'],
      });
    }

    const result = await CloseBimestreTurmaService({
      turmaId,
      disciplinaId,
      bimestre,
      anoLetivo,
    });

    return res.status(200).json(result);

  } catch (error: any) {
    Logger.error(`Erro ao fechar bimestre: ${error.message}`);

    return res.status(400).json({
      errors: [error.message || 'Erro ao fechar bimestre.'],
    });
  }
};
