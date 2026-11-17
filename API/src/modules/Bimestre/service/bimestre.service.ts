import { DisciplineRepository } from "../../Discipline/discipline.repository.js";
import GradeModel from "../../Grade/Grade.model.js";
import BimestreResultModel from "../bimestre.model.js";
import studentModel from "../../Student/student.model.js";
import teacherModel from "../../Teacher/teacher.model.js";

type RequestCloseBimestreTurma = {
  turmaId: string;
  disciplinaId: string;
  bimestre: 1 | 2 | 3 | 4;
  anoLetivo: number;
  userId?: string;
  role?: string;
};

async function ensureProfessorCanManage(data: RequestCloseBimestreTurma) {
  if (data.role !== 'professor') return;

  const teacher: any = await teacherModel
    .findOne({ user: data.userId })
    .populate({
      path: 'turmas',
      populate: { path: 'disciplinas' },
    });

  if (!teacher) throw new Error('Professor não encontrado.');

  const turma = (teacher.turmas ?? []).find(
    (item: any) => String(item._id) === String(data.turmaId),
  );

  if (!turma) throw new Error('Você não leciona nesta turma.');

  const possuiDisciplina = (turma.disciplinas ?? []).some(
    (disciplina: any) => String(disciplina._id) === String(data.disciplinaId),
  );

  if (!possuiDisciplina) {
    throw new Error('A disciplina não pertence à turma selecionada.');
  }
}

export async function CloseBimestreTurmaService(
  data: RequestCloseBimestreTurma,
) {
  await ensureProfessorCanManage(data);

  const disciplina = await DisciplineRepository.findById(data.disciplinaId);
  if (!disciplina) throw new Error("Disciplina não encontrada.");

  const alunos = await studentModel.find({
    turma: data.turmaId,
    status: 'ativo',
  });

  if (alunos.length === 0) {
    throw new Error("Nenhum aluno encontrado na turma.");
  }

  for (const aluno of alunos) {
    const jaFechado = await BimestreResultModel.findOne({
      aluno: aluno._id,
      disciplina: data.disciplinaId,
      bimestre: data.bimestre,
      anoLetivo: data.anoLetivo,
    });

    if (jaFechado) {
      throw new Error(`O aluno ${aluno.nome} já está com o bimestre fechado.`);
    }

    const notas = await GradeModel.find({
      aluno: aluno._id,
      disciplina: data.disciplinaId,
      bimestre: data.bimestre,
      anoLetivo: data.anoLetivo,
    });

    if (notas.length !== disciplina.quantidadeNotas) {
      throw new Error(
        `O aluno ${aluno.nome} não possui todas as notas lançadas.`,
      );
    }
  }

  const resultados = [];

  for (const aluno of alunos) {
    const notas = await GradeModel.find({
      aluno: aluno._id,
      disciplina: data.disciplinaId,
      bimestre: data.bimestre,
      anoLetivo: data.anoLetivo,
    });

    const soma = notas.reduce((acc, n) => acc + n.nota, 0);
    const media = soma / disciplina.quantidadeNotas;

    await BimestreResultModel.create({
      aluno: aluno._id,
      disciplina: data.disciplinaId,
      bimestre: data.bimestre,
      anoLetivo: data.anoLetivo,
      media,
    });

    resultados.push({
      aluno: aluno.nome,
      media,
    });
  }

  return {
    msg: "Bimestre fechado com sucesso para toda a turma.",
    totalAlunos: resultados.length,
    resultados,
  };
}

export async function ReopenBimestreTurmaService(
  data: RequestCloseBimestreTurma,
) {
  await ensureProfessorCanManage(data);

  const disciplina = await DisciplineRepository.findById(data.disciplinaId);
  if (!disciplina) throw new Error("Disciplina não encontrada.");

  const alunos = await studentModel
    .find({ turma: data.turmaId, status: 'ativo' })
    .select('_id');

  if (alunos.length === 0) {
    throw new Error("Nenhum aluno encontrado na turma.");
  }

  const result = await BimestreResultModel.deleteMany({
    aluno: { $in: alunos.map((aluno) => aluno._id) },
    disciplina: data.disciplinaId,
    bimestre: data.bimestre,
    anoLetivo: data.anoLetivo,
  });

  if (result.deletedCount === 0) {
    throw new Error("Nenhum bimestre fechado encontrado para reabrir.");
  }

  return {
    msg: "Bimestre reaberto com sucesso.",
    totalAlunos: result.deletedCount,
  };
}
