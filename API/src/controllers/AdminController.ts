import { CustomRequest } from '../middlewares/authGuard.js';
import User from '../models/User.js';
import { Request, Response } from 'express';

export const modifyDataUser = async (req: CustomRequest, res: Response) => {
  const { userId, role } = req.body;
  const adminId = req.user._id;

  const rolesPermited = ['professor', 'coordenador', 'pendente', 'admin'];

  try {
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        errors: ['Admin não encontrado!'],
      });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        errors: ['Usuário não encontrado!'],
      });
    }

    if (!rolesPermited.includes(role)) {
      return res.status(422).json({
        errors: ['Função inválida!'],
      });
    }

    user.role = role;

    await user.save();

    res.status(201).json({
      msg: 'Função modificada com sucesso!',
      user,
    });
  } catch (err) {
    res.status(500).json({
      errors: ['Erro interno do servidor!'],
    });
    console.log(err);
  }
};
