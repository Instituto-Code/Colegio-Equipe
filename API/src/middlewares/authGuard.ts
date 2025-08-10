import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

//CustomRequest para expandir a requisição com a tipagem de user
export interface CustomRequest extends Request {
  user?: any;
}

export const authGuard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Pega o token e verifica se existe um cabeçalho
  if (!token) {
    return res.status(401).json({
      errors: ['Acesso Negado!'],
    });
  }
  try {
    if (!JWT_SECRET) {
      console.error("Erro ao acessar variável de ambiente 'JWT_SECRET'");
      return;
    }

    const verification = jwt.verify(token, JWT_SECRET) as { id: string }; // Verificação do token
    const user = await User.findById(verification.id).select('-password');

    if (!user) {
      return res.status(422).json({
        error: 'Usuário não encontrado!',
      });
    }

    req.user = user;

    return next();
  } catch (errors) {
    console.log(errors);
    return res.status(500).json({
      errors: ['Erro interno do servidor'],
    });
  }
};
