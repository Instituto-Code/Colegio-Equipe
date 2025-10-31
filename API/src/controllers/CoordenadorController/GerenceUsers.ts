import Logger from '../../../config/logger.js';
import { CustomRequest } from '../../middlewares/authGuard.js';
import { Response } from 'express';
import Aluno from '../../models/Aluno.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

//Excluindo alunos
export const deleteStudents = async (req: CustomRequest, res: Response) => {
  try {
    const { studentId } = req.params;

    const student = await Aluno.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({
        error: 'Aluno não encontrado.',
      });
    }

    res.status(200).json({
      msg: 'Aluno deletado com sucesso.',
    });
  } catch (error: any) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Editando alunos
export const editStudents = async (req: CustomRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    const { nome, matricula, cpf, dataNasc, sexo, status } = req.body;

    if(!mongoose.Types.ObjectId.isValid(studentId)){
        return res.status(400).json({ error: "ID inválido." });
    }

    const student = await Aluno.findById(studentId);

    if (!student) {
      return res.status(404).json({
        error: 'Aluno não encontrado.',
      });
    }

    if (nome) {
      student.nome = nome;
    }

    if (matricula) {
      student.matricula = matricula;
    }

    if (cpf) {
      student.cpf = cpf;
    }

    if (dataNasc) {
      student.dataNasc = dataNasc;
    }

    if (sexo) {
      student.sexo = sexo;
    }

    if (status) {
      student.status = status;
    }

    await student.save();

    res.status(200).json({
      msg: 'Dados atualizados.',
      student
    });
  } catch (error: any) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Editar usuários no geral
export const editUser = async (req: CustomRequest, res: Response) => {
  try{
    const { userId } = req.params;
    const { role } = req.body;

    const rolesPermited = ['professor', 'coordenador', 'pendente'];

    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({ error: "ID inválido." });
    };

    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({
        error: "Usuário não encontrado."
      });
    };

    if(!rolesPermited.includes(role)){
      return res.status(400).json({
        error: "Informe um role permitido ('professor', 'coordenador', 'pendente')"
      });
    };

    if(role){
      user.role = role;
    };

    await user.save();

    res.status(200).json({
      msg: "Usuário editado com sucesso.",
      newUser: user
    });

  }
  catch(error: any){
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
}

