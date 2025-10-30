//Importando modelos necessários
import Professor from '../models/Professor.js';
import Aluno from '../models/Aluno.js';
import Disciplina from '../models/Disciplina.js';
import { Response } from 'express';
import { CustomRequest } from '../middlewares/authGuard.js';
import { INota } from '../models/Aluno.js';
import Logger from '../../config/logger.js';

//Funcionalidade de inserir notas
export const insertGrades = async (req: CustomRequest, res: Response) => {
  const { disciplinaId, studentId, tipo, nota, data } = req.body;

  try {
    //Filtrando disciplina
    const disciplina = await Disciplina.findById(disciplinaId);

    //Validando
    if (!disciplina) {
      return res.status(404).json({ errors: ['Disciplina não encontrada!'] });
    }

    //verificando se o usuário logado é um professor
    const roleAccepted = 'professor';

    //Verificando se o role do usuário logado é de professor
    if (req.user.role !== roleAccepted) {
      return res.status(422).json({ errors: ['Permissões insuficientes!'] });
    }

    //pegando id de professor do usuário logado
    const professor = await Professor.findOne({ user: req.user._id }).select(
      '_id',
    );

    if (!professor) {
      return res.status(404).json({ errors: ['Professor não encontrado!'] });
    }

    const teacherId = professor._id;

    if (!teacherId) {
      return res.status(404).json({
        error: 'Professor não encontrado.',
      });
    }

    //Verificando se o aluno existe
    const student = await Aluno.findById(studentId);

    if (!student) {
      return res.status(404).json({ errors: ['Aluno não encontrado!'] });
    }

    //Verificação para evitar duplicatas em notas (tipo, disciplina e nome)
    const hasGrade = student.notas.find(
      (nota) =>
        nota.disciplina.toString() === disciplinaId && nota.tipo === tipo,
    );

    if (hasGrade) {
      return res.status(422).json({
        errors: ['Tipo de nota e tipo para essa disciplina já está lançado!'],
      });
    }

    //Criando dados da nota
    const dataGrade: INota = {
      disciplina: disciplinaId,
      professor: teacherId,
      tipo,
      nota,
      data: data || new Date(),
    };

    //salvando nota no esquema do aluno
    student.notas.push(dataGrade);

    await student.save();

    res.status(201).json({
      msg: 'Nota salva com sucesso!',
      nota: dataGrade,
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Frequencia para o aluno
export const insertAttendance = async (req: CustomRequest, res: Response) => {
  const { studentId, tipo, data } = req.body;

  try {
    //Validações de aluno
    const student = await Aluno.findById(studentId);

    if (!student) {
      return res.status(404).json({ errors: ['Aluno não encontrado!'] });
    }

    //verificando se o usuário logado é um professor
    const roleAccepted = 'professor';

    //Verificando se o role do usuário logado é de professor
    if (req.user.role !== roleAccepted) {
      return res.status(422).json({ errors: ['Permissões insuficientes!'] });
    }

    //Validações de role
    const professor = await Professor.findOne({ user: req.user._id }).select(
      '_id',
    );

    if (!professor) {
      return res.status(404).json({ errors: ['Professor não encontrado!'] });
    }

    //Incrementando presenças e faltas
    if (tipo === 'presencas') {
      student.frequencia.presencas += 1;
    }

    if (tipo === 'faltas') {
      student.frequencia.faltas += 1;
    }

    student.frequencia.data = data;

    await student.save();

    res.status(201).json({
      msg: 'Frequencia adicionada!',
      frequencia: student.frequencia,
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listagem de turmas em que o professor leciona
export const listClasses = async (req: CustomRequest, res: Response) => {
  try {
    //Pegando id do usuário logado
    const user = req.user;

    //Validando role do usuário loado
    if (user.role !== 'professor') {
      return res.status(422).json({ errors: ['Permissões insuficientes!'] });
    }

    //Buscando professor pelo id do usuário logado
    const professor = await Professor.findOne({ user: user._id }).populate(
      'turmas',
    );

    if (!professor) {
      return res.status(404).json({
        errors: ['Professor não encontrado!'],
      });
    }

    res.status(200).json({
      classesList: professor.turmas,
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Funcionalidades de anotações sobre os alunos para os pais
export const notes = async (req: CustomRequest, res: Response) => {
  const { studentId, anotacao } = req.body;

  try {
    const student = await Aluno.findById(studentId);

    if (!student) {
      return res.status(404).json({ errors: ['Aluno não encontrado!'] });
    }

    //Buscando usuário para filtrar quem é professor
    const user = req.user;

    const professorDoc = await Professor.findOne({ user: user._id }).select(
      '_id',
    );

    if (!professorDoc) {
      return res.status(404).json({
        error: 'Id desconhecido.',
      });
    }

    //Criando anotação
    const professor = await Professor.findById(professorDoc);

    if (!professor) {
      return res.status(404).json({ errors: ['Professor não encontrado!'] });
    }

    //Criando anotação
    const newNote = {
      professor: professorDoc?._id,
      anotacao: anotacao,
    };

    student.anotacoes.push(newNote);

    await student.save();

    res.status(201).json({
      msg: 'Anotação adicionada com sucesso!',
      anotação: newNote,
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};
