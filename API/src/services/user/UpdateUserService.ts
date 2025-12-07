import { UserRepository } from '../../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';
import { IAddress } from '../../types/user/user.type.js';
import { CustomRequest } from '../../middlewares/authGuard.js';
import Logger from '../../../config/logger.js';

type DataUpdate = {
  name: string;
  password: string;
  cpf: string;
  numberTel: string;
  dataNasc: Date;
  adress: IAddress;
  req: CustomRequest;
};

export async function UpdateUserService({
  name,
  password,
  cpf,
  numberTel,
  dataNasc,
  adress,
  req,
}: DataUpdate) {

  const userLogged = req.user;
  const user = await UserRepository.findById(userLogged.id);

  if (!user) {
    Logger.warn('Usuário não encontrado.');
    throw new Error('Usuário não encontrado.');
  }

  //Atualizando nome
  if (name) {
    user.name = name;
  }

  //Atualizando senha
  if (password) {
    const salt = await bcrypt.genSalt();
    const newPass = await bcrypt.hash(password, salt);
    user.password = newPass;
  }

  if (cpf) {
    user.cpf = cpf;
  }

  if (numberTel) {
    user.numberTel = numberTel;
  }

  if (dataNasc) {
    user.dataNasc = dataNasc;
  }

  if (adress) {
    user.adress = adress;
  }

  //salvando usuário
  await user.save();

  return `Dado(s) atualizados com sucesso`;
}
