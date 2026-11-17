import { DisciplineRepository } from '../../Discipline/discipline.repository.js';
import { StudentRepository } from '../../Student/student.repository.js';
import { TeacherRepository } from '../teacher.repository.js';
import { GradeRepository } from '../../Grade/Grade.repository.js';
import GradeModel from '../../Grade/Grade.model.js';
import studentModel from '../../Student/student.model.js';
import bimestreModel from '../../Bimestre/bimestre.model.js';

type AttendanceStatus = 'presente' | 'falta';

type RequestInsertGrade = {
  userId: string;
  disciplinaId: string;
  studentId: string;
  bimestre: 1 | 2 | 3 | 4;
  tipo: string;
  nota: number;
  data?: Date | string;
  date?: Date | string;
  anoLetivo?: number;
};

type RequestUpdateGrade = {
  userId: string;
  gradeId: string;
  tipo?: string;
  nota?: number;
  data?: Date | string;
  bimestre?: 1 | 2 | 3 | 4;
};

type RequestDeleteGrade = {
  userId: string;
  gradeId: string;
};

type AttendanceRecord = {
  studentId: string;
  status: AttendanceStatus;
};

type RequestInsertAttendance = {
  userId: string;
  turmaId: string;
  disciplinaId: string;
  data: Date | string;
  registros: AttendanceRecord[];
};

type RequestListAttendance = {
  userId: string;
  turmaId: string;
  disciplinaId: string;
  data?: Date | string;
};

type DataNote = {
  userId: string;
  studentId: string;
  anotacao: string;
};

function parseDate(value?: Date | string, field = 'Data') {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} inválida.`);
  }

  return date;
}

function startOfDay(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfDay(date: Date) {
  const end = startOfDay(date);
  end.setDate(end.getDate() + 1);
  return end;
}

function parseBimestre(value: unknown, field = 'Bimestre') {
  const bimestre = Number(value);

  if (![1, 2, 3, 4].includes(bimestre)) {
    throw new Error(`${field} inválido.`);
  }

  return bimestre as 1 | 2 | 3 | 4;
}

function parseNota(value: unknown) {
  const nota = Number(value);

  if (!Number.isFinite(nota) || nota < 0 || nota > 10) {
    throw new Error('Nota inválida. Informe um valor entre 0 e 10.');
  }

  return nota;
}

async function findTeacher(userId: string) {
  const teacher = await TeacherRepository.findByUser(userId);

  if (!teacher) throw new Error('Professor não encontrado.');

  return teacher as any;
}

function findTeacherClassForStudent(teacher: any, student: any) {
  const studentClassIds = ((student.turma ?? []) as any[]).map((turma) =>
    String(turma?._id ?? turma),
  );

  const turma = ((teacher.turmas ?? []) as any[]).find((teacherClass: any) =>
    studentClassIds.includes(String(teacherClass._id)),
  );

  if (!turma) throw new Error('Você não possui vínculo com este aluno.');

  return turma;
}

function findDisciplineInClass(turma: any, disciplinaId: string) {
  const disciplina = ((turma.disciplinas ?? []) as any[]).find(
    (item: any) => String(item?._id ?? item) === String(disciplinaId),
  );

  if (!disciplina) {
    throw new Error('A disciplina não pertence à turma do aluno.');
  }

  return disciplina;
}

function findTeacherClass(teacher: any, turmaId: string) {
  const turma = ((teacher.turmas ?? []) as any[]).find(
    (item: any) => String(item._id) === String(turmaId),
  );

  if (!turma) throw new Error('Você não leciona nesta turma.');

  return turma;
}

async function ensureBimestreAberto(
  studentId: string,
  disciplinaId: string,
  bimestre: number,
  anoLetivo: number,
) {
  const fechado = await bimestreModel.findOne({
    aluno: studentId,
    disciplina: disciplinaId,
    bimestre,
    anoLetivo,
  });

  if (fechado) {
    throw new Error('Não é possível lançar ou alterar notas: bimestre fechado.');
  }
}

export async function InsertGradeService(data: RequestInsertGrade) {
  const teacher = await findTeacher(data.userId);

  if (!data.disciplinaId) throw new Error('Disciplina é obrigatória.');
  if (!data.studentId) throw new Error('Aluno é obrigatório.');
  if (!data.tipo) throw new Error('Tipo de nota é obrigatório.');

  const student = await StudentRepository.findById(data.studentId);
  if (!student) throw new Error('Aluno não encontrado.');

  const turma = findTeacherClassForStudent(teacher, student);
  const discipline = await DisciplineRepository.findById(data.disciplinaId);

  if (!discipline) throw new Error('Disciplina não encontrada.');

  findDisciplineInClass(turma, data.disciplinaId);

  const bimestre = parseBimestre(data.bimestre);
  const nota = parseNota(data.nota);
  const gradeDate = parseDate(data.data ?? data.date, 'Data da nota');
  const anoLetivo =
    Number(data.anoLetivo) ||
    Number(turma.anoLetivo) ||
    new Date().getFullYear();

  await ensureBimestreAberto(
    data.studentId,
    data.disciplinaId,
    bimestre,
    anoLetivo,
  );

  const notasLancadas = await GradeModel.countDocuments({
    aluno: data.studentId,
    disciplina: data.disciplinaId,
    bimestre,
    anoLetivo,
  });

  if (notasLancadas >= discipline.quantidadeNotas) {
    throw new Error(
      `A disciplina ${discipline.nome} permite apenas ${discipline.quantidadeNotas} nota(s) por bimestre.`,
    );
  }

  const grade = await GradeRepository.create({
    aluno: data.studentId,
    disciplina: data.disciplinaId,
    professor: teacher._id,
    tipo: data.tipo,
    bimestre,
    nota,
    data: gradeDate,
    anoLetivo,
  });

  student.grades.push(grade._id);
  await student.save();

  return {
    msg: 'Nota lançada com sucesso.',
    grade,
  };
}

export async function UpdateGradeService(data: RequestUpdateGrade) {
  const teacher = await findTeacher(data.userId);
  const grade = await GradeModel.findById(data.gradeId);

  if (!grade) throw new Error('Nota não encontrada.');

  if (String(grade.professor) !== String(teacher._id)) {
    throw new Error('Você só pode editar notas lançadas por você.');
  }

  const bimestre = parseBimestre(data.bimestre ?? grade.bimestre);
  const anoLetivo = Number((grade as any).anoLetivo) || new Date().getFullYear();

  await ensureBimestreAberto(
    String(grade.aluno),
    String(grade.disciplina),
    Number(grade.bimestre),
    anoLetivo,
  );

  if (bimestre !== Number(grade.bimestre)) {
    await ensureBimestreAberto(
      String(grade.aluno),
      String(grade.disciplina),
      bimestre,
      anoLetivo,
    );
  }

  const update: Record<string, any> = { bimestre };

  if (data.tipo !== undefined) {
    if (!data.tipo) throw new Error('Tipo de nota é obrigatório.');
    update.tipo = data.tipo;
  }

  if (data.nota !== undefined) update.nota = parseNota(data.nota);
  if (data.data !== undefined) update.data = parseDate(data.data, 'Data da nota');

  const updated = await GradeModel.findByIdAndUpdate(data.gradeId, update, {
    new: true,
  });

  return {
    msg: 'Nota atualizada com sucesso.',
    grade: updated,
  };
}

export async function DeleteGradeService(data: RequestDeleteGrade) {
  const teacher = await findTeacher(data.userId);
  const grade = await GradeModel.findById(data.gradeId);

  if (!grade) throw new Error('Nota não encontrada.');

  if (String(grade.professor) !== String(teacher._id)) {
    throw new Error('Você só pode excluir notas lançadas por você.');
  }

  const anoLetivo = Number((grade as any).anoLetivo) || new Date().getFullYear();

  await ensureBimestreAberto(
    String(grade.aluno),
    String(grade.disciplina),
    Number(grade.bimestre),
    anoLetivo,
  );

  await GradeModel.findByIdAndDelete(data.gradeId);
  await studentModel.updateOne(
    { _id: grade.aluno },
    { $pull: { grades: grade._id } } as any,
  );

  return {
    msg: 'Nota excluída com sucesso.',
  };
}

export async function InsertAttendanceService(data: RequestInsertAttendance) {
  const teacher = await findTeacher(data.userId);
  const turma = findTeacherClass(teacher, data.turmaId);

  findDisciplineInClass(turma, data.disciplinaId);

  const attendanceDate = parseDate(data.data, 'Data da frequência');
  const registros = data.registros ?? [];

  if (registros.length === 0) {
    throw new Error('Informe a frequência de pelo menos um aluno.');
  }

  const studentIds = registros.map((registro) => registro.studentId);

  const students = await studentModel.find({
    _id: { $in: studentIds },
    turma: data.turmaId,
  });

  if (students.length !== new Set(studentIds).size) {
    throw new Error('Um ou mais alunos não pertencem à turma selecionada.');
  }

  const start = startOfDay(attendanceDate);
  const end = endOfDay(attendanceDate);

  for (const registro of registros) {
    if (!['presente', 'falta'].includes(registro.status)) {
      throw new Error('Status de frequência inválido.');
    }

    await studentModel.updateOne(
      { _id: registro.studentId },
      {
        $pull: {
          frequencia: {
            disciplina: data.disciplinaId,
            data: { $gte: start, $lt: end },
          },
        },
      } as any,
    );

    await studentModel.updateOne(
      { _id: registro.studentId },
      {
        $push: {
          frequencia: {
            disciplina: data.disciplinaId,
            professor: teacher._id,
            data: attendanceDate,
            status: registro.status,
          },
        },
      } as any,
    );
  }

  return {
    msg: 'Frequência salva com sucesso.',
    total: registros.length,
  };
}

export async function ListAttendanceService(data: RequestListAttendance) {
  const teacher = await findTeacher(data.userId);
  const turma = findTeacherClass(teacher, data.turmaId);

  findDisciplineInClass(turma, data.disciplinaId);

  const attendanceDate = parseDate(data.data, 'Data da frequência');
  const start = startOfDay(attendanceDate);
  const end = endOfDay(attendanceDate);

  const students = await studentModel
    .find({ turma: data.turmaId, status: 'ativo' })
    .sort({ nome: 1 });

  const alunos = students.map((student: any) => {
    const registro = (student.frequencia ?? []).find((item: any) => {
      const itemDate = new Date(item.data);

      return (
        String(item.disciplina) === String(data.disciplinaId) &&
        itemDate >= start &&
        itemDate < end
      );
    });

    return {
      id: student._id,
      nome: student.nome,
      matricula: student.matricula,
      status: registro?.status ?? null,
    };
  });

  const resumo = alunos.reduce(
    (acc: { presentes: number; faltas: number; naoRegistrados: number }, aluno: any) => {
      if (aluno.status === 'presente') acc.presentes += 1;
      else if (aluno.status === 'falta') acc.faltas += 1;
      else acc.naoRegistrados += 1;

      return acc;
    },
    { presentes: 0, faltas: 0, naoRegistrados: 0 },
  );

  return {
    turmaId: data.turmaId,
    disciplinaId: data.disciplinaId,
    data: attendanceDate,
    alunos,
    resumo,
  };
}

export async function NotesService(data: DataNote) {
  const teacher = await findTeacher(data.userId);
  const student = await StudentRepository.findById(data.studentId);

  if (!student) throw new Error('Aluno não encontrado.');
  if (!data.anotacao?.trim()) throw new Error('Anotação é obrigatória.');

  findTeacherClassForStudent(teacher, student);

  const newNote = {
    professor: teacher._id,
    anotacao: data.anotacao.trim(),
    data: new Date(),
  };

  student.anotacoes.push(newNote as any);
  await student.save();

  return {
    msg: 'Anotação adicionada com sucesso.',
    newNote,
  };
}
