import Pais from '../models/Pais.js';
import { Request, Response } from 'express';
import { CustomRequest } from '../middlewares/authGuard.js';

//Listar filhos
export const listChildrens = async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;

  try {
    //Buscando responsável pelo id de quem está logado
    const parent = await Pais.findOne({ user: userId }).populate(
      'filhos',
      'nome',
    );

    if (!parent) {
      return res
        .status(404)
        .json({ errors: ['Você não é responsável por nenhum aluno!'] });
    }

    //Armazenando filhos
    const childrens = parent.filhos;

    res.status(200).json({
      childrens,
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    console.log(error);
  }
};
