import Logger from '../../../config/logger.js';
import { generateToken } from '../../configs/generateToken.js';
import { UserRepository } from '../../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';

type Datalogin = {
  email: string;
  password: string;
};

export async function LoginUserService({ email, password }: Datalogin) {
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    Logger.error("Usuário não encontrado.");
    throw new Error('Usuário não encontrado.');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('Senha incorreta.');
  }

  const token = generateToken(user._id as string);

  return {
    token,
    id: user._id,
  };
}
