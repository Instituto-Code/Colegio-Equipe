import studentModel from '../../modules/Student/student.model.js';
import teacherModel from '../../modules/Teacher/teacher.model.js';
import schoolClassModel from '../../modules/schoolClass/schoolClass.model.js';
import disciplineModel from '../../modules/Discipline/discipline.model.js';
import { Request, Response } from 'express';
import { CustomRequest } from '../../middlewares/authGuard.js';
import userModel from '../../modules/User/user.model.js';
import Logger from '../../../config/logger.js';
import parentsModel from '../../modules/Parents/parents.model.js';
import mongoose from 'mongoose';
import { IUser } from '../../shared/types/user.type.js';
import { IAluno } from '../../shared/types/student.type.js';

//Contando documentos
export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const [totalAlunos, totalProfessores, totalTurmas, totalDisciplinas] =
      await Promise.all([
        studentModel.countDocuments(),
        teacherModel.countDocuments(),
        schoolClassModel.countDocuments(),
        disciplineModel.countDocuments(),
      ]);

    //Retornando quantidade de dados
    res.status(200).json({
      totalAlunos,
      totalProfessores,
      totalTurmas,
      totalDisciplinas,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listando todos os usuários
export const listUsers = async (req: CustomRequest, res: Response) => {
  try {
    //Configurando paginação
    const { search = '', page = 1, limit } = req.query;

    const usersQuery = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const totalUsers = await userModel.countDocuments(usersQuery);

    const limitNumber = limit ? Number(limit) : totalUsers;

    const skip = (Number(page) - 1) * limitNumber;

    const allUsers = await userModel
      .find(usersQuery)
      .skip(skip)
      .limit(limitNumber);

    if (allUsers.length === 0) {
      return res.status(200).json({
        users: [],
        msg: 'Nenhum usuário cadastrado.',
      });
    }

    const usersFormated = allUsers.map((u) => ({
      id: u._id,
      nome: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
    }));

    return res.status(200).json({
      total: totalUsers,
      page: Number(page),
      limit: limitNumber,
      users: usersFormated,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listando alunos
export const listStudents = async (req: CustomRequest, res: Response) => {
  try {
    //Buscando alunos e populando dados dos parentes
    const alunos = await studentModel
      .find()
      .populate({
        path: 'parents',
        populate: {
          path: 'user',
          select: 'name email',
        },
      })
      .populate('turma', 'nome, turno, anoLetivo');

    //Editando dados que vão para o frontend
    const alunosFormatados = alunos.map((aluno) => ({
      id: aluno._id,
      nome: aluno.nome,
      status: aluno.status || 'ativo',
      matricula: aluno.matricula,
      dataNasc: aluno.dataNasc,
      pais: aluno.parents.map((p: any) => ({
        id: p._id,
        nome: p.user?.name,
        email: p.user?.email,
      })),
    }));

    res.status(200).json({ alunos: alunosFormatados });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listando um aluno específico
export const listOneStudent = async (req: CustomRequest, res: Response) => {
  try {
    const { studentId } = req.params;

    const aluno = await studentModel
      .findById(studentId)
      .populate({
        path: 'parents',
        populate: {
          path: 'user',
          select: 'name email numberTel cpf',
        },
      })
      .populate({
        path: 'turma',
        select: 'nome turno anoLetivo disciplinas',
        populate: {
          path: 'disciplinas',
          select: 'nome cargaHoraria descrição',
        },
      })
      .populate("grades", "bimestre tipo nota data")
      .populate({
        path: 'grades',
        populate: {
          path: 'disciplina',
          select: 'nome cargaHoraria descrição',
        },
      });

    if (!aluno) {
      return res.status(404).json({
        error: 'Aluno não encontrado',
      });
    }

    const turmas = Array.isArray(aluno.turma) ? aluno.turma : [];
    const grades = Array.isArray(aluno.grades) ? aluno.grades : [];

    const alunoFormatado = {
      id: aluno._id,
      nome: aluno.nome,
      status: aluno.status,
      matricula: aluno.matricula,
      dataNasc: aluno.dataNasc,
      pais: aluno.parents.map((p: any) => ({
        id: p._id,
        nome: p.user?.name,
        email: p.user?.email,
        numberTel: p.user?.numberTel,
        cpf: p.user?.cpf,
      })),
      turma: turmas?.map((t: any) => ({
        id: t._id,
        nome: t.nome,
        turno: t.turno,
        anoLetivo: t.anoLetivo,
        disciplinas: t.disciplinas.map((d: any) => ({
          id: d._id,
          nome: d.nome,
          descricao: d.descricao,
          cargaHoraria: d.cargaHoraria,
        })),
      })),
      grades: grades?.map((g: any) => ({
        id: g._id,
        bimestre: g.bimestre,
        tipo: g.tipo,
        nota: g.nota,
        data: g.data,
        disciplina: {
          id: g.disciplina._id,
          nome: g.disciplina.nome
        }
      }))
    };

    res.status(200).json({
      aluno: alunoFormatado,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listando dados de professores

export const listTeachers = async (req: CustomRequest, res: Response) => {
  try {
    const professores = await teacherModel
      .find()
      .populate('user', 'name email active')
      .populate('turmas', 'nome turno anoLetivo');

    const professoresFormatados = professores.map((professor) => {
      let nome = professor.nome || 'Sem nome';
      let email;
      let active;

      // Se o user foi populado listar dados
      if (
        professor.user &&
        typeof professor.user === 'object' &&
        'name' in professor.user
      ) {
        nome = (professor.user as IUser).name;
        email = (professor.user as IUser).email;
        active = (professor.user as IUser).active;
      }

      return {
        id: professor._id,
        nome,
        email,
        active,
        matricula: professor.matricula,
        formacaoAcademica: professor.formacaoAcademica,
        turmas: professor.turmas.map((t: any) => ({
          id: t._id,
          nome: t.nome,
          turno: t.turno,
          anoLetivo: t.anoLetivo,
        })),
      };
    });

    res.status(200).json({
      professores: professoresFormatados,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listar professor
export const listOneTeacher = async (req: CustomRequest, res: Response) => {
  try {
    const { teacherId } = req.params;

    const professor = await teacherModel
      .findById(teacherId)
      .populate('user', 'name email active')
      .populate('turmas', 'nome turno anoLetivo');

    if (!professor) {
      return res.status(404).json({
        error: 'Professor não encontrado',
      });
    }

    let nome = professor.nome || 'Sem nome';
    let email;
    let active;

    if (
      professor.user &&
      typeof professor.user === 'object' &&
      'name' in professor.user
    ) {
      nome = (professor.user as IUser).name;
      email = (professor.user as IUser).email;
      active = (professor.user as IUser).active;
    }

    const teacherFormated = {
      id: professor._id,
      nome,
      email,
      active,
      matricula: professor.matricula,
      formacaoAcademica: professor.formacaoAcademica,
      turmas: professor.turmas.map((t: any) => ({
        id: t._id,
        nome: t.nome,
        turno: t.turno,
        anoLetivo: t.anoLetivo,
      })),
    };

    res.status(200).json({
      professor: teacherFormated,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listagem de turmas
export const listClasses = async (req: CustomRequest, res: Response) => {
  try {
    const turmas = await schoolClassModel
      .find()
      .populate({
        path: 'professores',
        select: 'matricula nome user',
        populate: {
          path: 'user',
          select: 'nome',
        },
      })
      .populate('disciplinas', 'nome cargaHoraria')
      .populate('alunos', 'nome matricula');

    if (turmas.length === 0) {
      res.status(200).json({
        turmas: [],
        msg: 'Nenhuma turma cadastrada.',
      });
    }

    //Estruturando dados para mandar pela resposta
    const formatedData = turmas.map((turma) => ({
      id: turma._id,
      nome: turma.nome,
      turno: turma.turno,
      anoLetivo: turma.anoLetivo,
      totalProfessores: turma.professores.length,
      totalAlunos: turma.alunos.length,
      professores: turma.professores.map((p: any) => ({
        id: p._id,
        nome: p.user.name,
        matricula: p.matricula,
      })),
      disciplinas: turma.disciplinas.map((d: any) => ({
        id: d._id,
        nome: d.nome,
        cargaHoraria: d.cargaHoraria,
      })),
      alunos: turma.alunos.map((a: any) => ({
        id: a._id,
        nome: a.nome,
        matricula: a.matricula,
      })),
    }));

    res.status(200).json(formatedData);
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//List pais
export const listParents = async (req: CustomRequest, res: Response) => {
  try {
    const parents = await parentsModel
      .find()
      .populate<{ user: IUser }>('user', 'name email numberTel adress')
      .populate<{
        filhos: IAluno[];
      }>('filhos', 'nome matricula dataNasc status sexo cpf');

    if (parents.length === 0) {
      res.status(200).json({
        parents: [],
        msg: 'Lista de pais vazia.',
      });
    }

    const dataFormated = parents
      .filter((p) => p.user !== null)
      .map((p) => ({
        id: p._id,
        nome: p.user.name,
        email: p.user.email,
        numeroTel: p.user.numberTel,
        endereco: p.user.adress,
        filhos: p.filhos.map((f) => ({
          id: f._id,
          nome: f.nome,
          matricula: f.matricula,
          dataNasc: f.dataNasc,
          status: f.status,
          sexo: f.sexo,
          cpf: f.cpf,
        })),
      }));

    res.status(200).json({
      responsaveis: dataFormated,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//listar um Responsável
export const listParent = async (req: CustomRequest, res: Response) => {
  try {
    const { parentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    const parent = await parentsModel
      .findById(parentId)
      .populate<{ user: IUser }>('user', 'name email numberTel adress')
      .populate<{
        filhos: IAluno[];
      }>('filhos', 'nome matricula dataNasc status sexo cpf');

    if (!parent) {
      return res.status(404).json({
        error: 'Responsável não encontrado.',
      });
    }

    const formatedData = {
      id: parent._id,
      nome: parent.user.name,
      email: parent.user.email,
      numeroTel: parent.user.numberTel,
      endereco: parent.user.adress,
      filhos: parent.filhos.map((f) => ({
        id: f._id,
        nome: f.nome,
        matricula: f.matricula,
        dataNasc: f.dataNasc,
        status: f.status,
        sexo: f.sexo,
        cpf: f.cpf,
      })),
    };

    res.status(200).json({
      responsavel: formatedData,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro interno do servidor',
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};
