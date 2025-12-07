import User from '../models/User.js';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { sendResetPass } from '../configs/sendEmail.js';
import crypto from 'crypto';
import { CustomRequest } from '../middlewares/authGuard.js';
import Logger from '../../config/logger.js';
import { RegisterUserService } from '../services/user/RegisterUserService.js';
import { LoginUserService } from '../services/user/LoginUserService.js';
import { ProfileUserService } from '../services/user/ProfileUserService.js';
import { UpdateUserService } from '../services/user/UpdateUserService.js';
import { SendResetPassMailService } from '../services/user/SendResetMailService.js';
import { ResetPasswordService } from '../services/user/ResetPasswordService.js';
dotenv.config();

// Registrar usuário
export const register = async (req: CustomRequest, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const result = await RegisterUserService({ name, email, password });

    return res.status(201).json(result);
  } catch (error: any) {
    if (error?.message) {
      Logger.warn(`Erro de registro: ${error.message}`);
      return res.status(400).json({ errors: [error.message] });
    }

    Logger.error(`Erro interno no registro: ${error}`);
    res.status(500).json({ msg: 'Erro interno do servidor!' });
  }
};

// Login de usuário
export const login = async (req: CustomRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await LoginUserService({ email, password });

    return res.status(200).json(result);
  } catch (error: any) {
    if (error?.message) {
      Logger.warn(`Erro de login: ${error.message}`);
      return res.status(400).json({ errors: [error.message] });
    }

    // Erro inesperado
    Logger.error(`Erro interno no login: ${error}`);
    return res.status(500).json({ errors: ['Erro interno do servidor'] });
  }
};

//Acessando usuário logado
export const getCurentUser = async (req: CustomRequest, res: Response) => {
  try {
    const result = await ProfileUserService(req);
    res.status(200).json(result);
  } catch (error: any) {
    Logger.error(`Erro ao obter usuário logado: ${error}`);
    return res.status(500).json({ errors: ['Erro interno do servidor!'] });
  }
};

//Edição de nome e senha de usuário (pode mudar as possibilidades futuramente)
export const updateUser = async (req: CustomRequest, res: Response) => {
  const { name, password, cpf, numberTel, dataNasc, adress } = req.body;

  try {
    const result = await UpdateUserService({
      name,
      password,
      cpf,
      numberTel,
      dataNasc,
      adress,
      req,
    });

    res.status(201).json(result);
  } catch (error) {
    Logger.error(`Erro interno do servidor: ${error}`);
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
  }
};

//MODIFICAÇÃO DE SENHA DO USUÁRIO NA TELA DE LOGIN

//Pegando dados e enviando email
export const resetPassMail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await SendResetPassMailService(email);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ errors: [error.message] });
  }
};

//Rota que modifica a senha
export const resetPass = async (req: CustomRequest, res: Response) => {
  try {
    const user = await ResetPasswordService(req.params.token, req.body.newPass);

    if (!user) {
      return res.status(400).json({ errors: ["Token inválido ou expirado!"] });
    }

    res.status(201).json({ msg: "Senha redefinida com sucesso!" });
  } catch (err) {
    Logger.error(err);
    res.status(500).json({ errors: ["Erro interno do servidor!"] });
  }
};
