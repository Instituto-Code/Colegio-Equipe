import { Types } from 'mongoose';
import { INota } from '../../../shared/types/student.type.js';
import { DisciplineRepository } from '../../Discipline/discipline.repository.js';
import { StudentRepository } from '../../Student/student.repository.js';
import { TeacherRepository } from '../teacher.repository.js';
import { GradeRepository } from '../../Grade/Grade.repository.js';

type RequestInsertGrade = {
  userId: string;
  disciplinaId: string;
  studentId: string;
  teacherId: string;
  tipo: string;
  nota: number;
  data: Date;
  anoLetivo: number;
};

export async function InsertGradeService(data: RequestInsertGrade) {
  const discipline = await DisciplineRepository.findById(data.disciplinaId);
  if (!discipline) throw new Error('Disciplina não encontrada.');

  const teacher = await TeacherRepository.findByUser(data.userId);
  if (!teacher) throw new Error('Professor não encontrado.');

  const student = await StudentRepository.findById(data.studentId);
  if (!student) throw new Error('Aluno não encontrado!');

  if (!['prova', 'trabalho', 'recuperacao'].includes(data.tipo)) {
    throw new Error('Tipo de nota inválido.');
  }

  const dataGrade = {
    aluno: data.studentId,
    disciplina: data.disciplinaId,
    professor: teacher._id,
    tipo: data.tipo,
    nota: data.nota,
    data: data.data,
    anoLetivo: data.anoLetivo,
  };

  const grade = await GradeRepository.create(dataGrade);

  return {
    msg: 'Nota lançada com sucesso.',
    grade,
  };
}

type RequestInsertAttendance = {
  userId: string;
  studentId: string;
  tipo: 'presencas' | 'faltas';
  data: Date;
};

//Frequência do aluno
export async function InsertAttendanceService(data: RequestInsertAttendance) {
  const student = await StudentRepository.findById(data.studentId);
  if (!student) throw new Error('Aluno não encontrado!');

  const teacher = await TeacherRepository.findByUser(data.userId);
  if (!teacher) throw new Error('Professor não encontrado!');

  if (data.tipo !== 'presencas' && data.tipo !== 'faltas') {
    throw new Error('Tipo de frequência inválido!');
  }

  const update: any = {
    'frequencia.data': data.data,
  };

  if (data.tipo === 'presencas') {
    update.$inc = { 'frequencia.presencas': 1 };
  }

  if (data.tipo === 'faltas') {
    update.$inc = { 'frequencia.faltas': 1 };
  }

  await StudentRepository.updateById(data.studentId, update);

  return {
    msg: 'Frequência adicionada.',
  };
}

type DataNote = {
  userId: string;
  studentId: string;
  anotacao: string;
};

export async function NotesService(data: DataNote) {
  const student = await StudentRepository.findById(data.studentId);

  if (!student) throw new Error('Aluno não encontrado!');

  //Criando anotação
  const teacher = await TeacherRepository.findByUser(data.userId);

  if (!teacher) throw new Error('Professor não encontrado!');

  //Criando anotação
  const newNote = {
    professor: teacher?._id,
    anotacao: data.anotacao,
  };

  student.anotacoes.push(newNote);

  await student.save();

  return {
    msg: 'Anotação adicionada com sucesso',
    newNote,
  };
}
