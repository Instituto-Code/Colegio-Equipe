import jwt from 'jsonwebtoken';
import Logger from '../../config/logger.js';
const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (id: string) => {
  if (!JWT_SECRET) {
    Logger.error("Variável de ambiente 'JWT_SECRET' indefinida!");
    return null;
  }

  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};
