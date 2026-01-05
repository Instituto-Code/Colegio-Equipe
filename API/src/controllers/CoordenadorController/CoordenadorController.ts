import userModel from '../../modules/User/user.model.js';
import disciplineModel from '../../modules/Discipline/discipline.model.js';
import teacherModel from '../../modules/Teacher/teacher.model.js';
import schoolClassModel from '../../modules/schoolClass/schoolClass.model.js';
import studentModel from '../../modules/Student/student.model.js';
import parentsModel from '../../modules/Parents/parents.model.js';
import { Request, Response } from 'express';
import Logger from '../../../config/logger.js';
import mongoose from 'mongoose';
import { RegisterClassesService, RegisterStudentService } from '../../modules/Coordinator/services/coordinatorAction.service.js';

//CADASTRO DE PROFESSORES, ALUNOS, TURMAS E DISCIPLINAS ()



//Cadastrar os professores
export const registerTeacher = async (req: Request, res: Response) => {
  const { user, matricula, formacaoAcademica } = req.body;

  try {
    //Buscando professor pela matrícula
    const professor = await teacherModel.findOne({ matricula });

    //Validando se o professor já foi cadastrado
    if (professor) {
      return res.status(422).json({ errors: ['Professor existente!'] });
    }

    //Criando professor no banco de dados
    const newProfessor = await teacherModel.create({
      user,
      matricula,
      nome: user.nome,
      formacaoAcademica,
    });

    res.status(201).json({
      msg: 'Professor cadastrado com sucesso!',
      professor: newProfessor,
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Cadastrar disciplinas
export const registerDisciplines = async (req: Request, res: Response) => {
  const { nome, descrição, cargaHoraria } = req.body;

  try {
    //Buscar disciplina por nome
    const disciplina = await disciplineModel.findOne({ nome });

    //Não permite salvar duas disciplinas com o mesmo nome
    if (disciplina) {
      return res.status(404).json({ errors: ['Disciplina já existe!'] });
    }

    //Salvando disciplina
    const newDiscipline = await disciplineModel.create({
      nome,
      descrição,
      cargaHoraria,
    });

    res.status(201).json({
      msg: 'Disciplina cadastrada com sucesso!',
      disciplina: newDiscipline,
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Registrando pais
export const registerParents = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      error: "Id inválido"
    });
  }

  try {
    //Buscando usuário
    const user = await userModel.findById(userId).select('-password');

    //Validações
    if (!user) {
      return res.status(404).json({ errors: ['Usuário não encontrado!'] });
    }

    //Criando novo responsável
    const newParent = await parentsModel.create({
      user: userId,
    });

    //Atribuindo role de responsável ao usuário
    user.role = 'responsavel';

    await user.save();

    res.status(201).json({
      msg: 'Atribuição feita com sucesso!',
      responsável: newParent,
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//PREPARANDO OS RELACIONAMENTOS (CADASTROS ENTRE OS ESQUEMAS)

//Atribuindo turma a um professor

export const classToTeacher = async (req: Request, res: Response) => {
  const { teacherId, classId } = req.params;

  //Validando Ids
  if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(classId)) {
    return res.status(400).json({ errors: ["Ids inválidos."] });
  };

  try {
    //Buscando e validando turma
    const [classroom, teacher] = await Promise.all([
      schoolClassModel.findById(classId),
      teacherModel.findById(teacherId)
    ]);

    if (!classroom) {
      return res.status(404).json({ errors: ['Turma não encontrada!'] });
    }

    if (!teacher) {
      return res.status(404).json({ errors: ['Professor não encontrado'] });
    }

    if (classroom.professores.map(p => p.toString()).includes(teacherId)) {
      return res.status(400).json({
        error: "O professor já está na turma."
      });
    };

    //Salvando
    await Promise.all([
      schoolClassModel.findByIdAndUpdate(classId, { $addToSet: { professores: teacherId } }),
      teacherModel.findByIdAndUpdate(teacherId, { $addToSet: { turmas: classId } })
    ]);

    res.status(201).json({
      msg: 'Turma atribuída ao professor com sucesso!',
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Adicionando disciplina a turma ==> Pode sair mais pra frente
export const disciplineToClass = async (req: Request, res: Response) => {
  const { disciplineId, classId } = req.body;

  try {
    //Buscando disciplina
    const discipline = await disciplineModel.findById(disciplineId);

    if (!discipline) {
      return res.status(404).json({ errors: ['Disciplina não encontrada!'] });
    }

    //Buscando Turma
    const classroom = await schoolClassModel.findById(classId);

    if (!classroom) {
      return res.status(404).json({ errors: ['Turma não encontrada!'] });
    }

    //Verificando se disciplina não já está em turma
    if (classroom.disciplinas.includes(disciplineId)) {
      return res
        .status(404)
        .json({ errors: ['A disciplina já está registrada na turma!'] });
    }

    classroom.disciplinas.push(disciplineId);

    await classroom.save();

    res.status(201).json({
      msg: 'Disciplina registrada à turma com sucesso!',
    });
  } catch (error) {
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Adicionando aluno á turma
export const studentToClass = async (req: Request, res: Response) => {
  const { studentId, classId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(studentId) ||
    !mongoose.Types.ObjectId.isValid(classId)
  ) {
    return res.status(400).json({ errors: ["Ids inválidos."] });
  }

  try {
    const [student, classroom] = await Promise.all([
      studentModel.findById(studentId),
      schoolClassModel.findById(classId),
    ]);

    if (!student) {
      return res.status(404).json({ errors: ["Aluno não encontrado!"] });
    }

    if (!classroom) {
      return res.status(404).json({ errors: ["Turma não encontrada!"] });
    }

    // Verifica se o aluno já está nessa turma
    if (classroom.alunos.includes(student._id)) {
      return res.status(400).json({
        error: "O aluno já está nesta turma.",
      });
    }

    // Verifica se o aluno já está em outra turma
    const studentInAnotherClass = await schoolClassModel.exists({
      alunos: student._id,
    });

    if (studentInAnotherClass) {
      return res.status(400).json({
        error: "O aluno já está em outra turma.",
      });
    }

    await Promise.all([
      schoolClassModel.findByIdAndUpdate(classId, {
        $addToSet: { alunos: student._id },
      }),
      studentModel.findByIdAndUpdate(studentId, {
        $addToSet: { turma: classId },
      }),
    ]);

    return res.status(201).json({
      msg: "Aluno adicionado à turma com sucesso!",
    });
  } catch (error) {
    Logger.error(`Erro interno do servidor: ${error}`);
    return res.status(500).json({ errors: ["Erro interno do servidor!"] });
  }
};


//Atribuindo aluno ao pai
export const studentToParent = async (req: Request, res: Response) => {
  const { studentId, parentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(parentId)) {
    return res.status(400).json({
      error: "Ids inválidos"
    });
  };

  try {

    const [student, parent] = await Promise.all([
      studentModel.findById(studentId),
      parentsModel.findById(parentId)
    ]);

    //Validação
    if (!student) {
      return res.status(404).json({ errors: ['Aluno não encontrado!'] });
    };

    //Validação
    if (!parent) {
      return res.status(404).json({ errors: ['Responsável não encontrado!'] });
    };

    if (student.parents.map(p => p.toString()).includes(parentId)) {
      return res.status(400).json({
        error: "Responsável já atribuído ao estudante."
      });
    };

    await Promise.all([
      studentModel.findByIdAndUpdate(studentId, { $addToSet: { parents: parentId } }),
      parentsModel.findByIdAndUpdate(parentId, { $addToSet: { filhos: studentId } })
    ]);

    res.status(201).json({
      msg: 'Atribuição de responsável ao filho(a) feita com sucesso!',
    });

  } catch (error) {

    res.status(500).json({ errors: ['Erro interno do servidor!'] });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

