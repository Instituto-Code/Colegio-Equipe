import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from './authGuard.js';

//Middleware de proteção de rota com base no role do usuário
export const authorizeRole = (role: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!role.includes(req.user.role)) {
      return res.status(403).json({ errors: ['Acesso negado!'] });
    }

    return next();
  };
};
