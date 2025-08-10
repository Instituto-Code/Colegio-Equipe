import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from './authGuard.js';

//Middleware de proteção de rota com base no role do usuário
export const authorizeRole = (role: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(422).json({ errors: ['Acesso negado!'] });
    }

    return next();
  };
};
