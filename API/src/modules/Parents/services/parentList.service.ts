import mongoose from "mongoose";
import studentModel from "../../Student/student.model.js";
import { IUser } from "../../../shared/types/user.type.js";
import { ParentRepository } from "../parents.repository.js";

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);

function formatTurma(turma: any) {
  return {
    id: turma?._id,
    nome: turma?.nome,
    turno: turma?.turno,
    anoLetivo: turma?.anoLetivo,
    disciplinas: asArray(turma?.disciplinas).map((disciplina: any) => ({
      id: disciplina?._id,
      nome: disciplina?.nome,
      descricao: disciplina?.descricao ?? disciplina?.["descrição"],
      cargaHoraria: disciplina?.cargaHoraria,
      quantidadeNotas: disciplina?.quantidadeNotas,
    })),
  };
}

function formatChild(child: any) {
  return {
    id: child?._id,
    nome: child?.nome,
    matricula: child?.matricula,
    status: child?.status,
    dataNasc: child?.dataNasc,
    sexo: child?.sexo,
    turma: asArray(child?.turma)
      .filter((turma: any) => turma && typeof turma === "object" && turma.nome)
      .map(formatTurma),
  };
}

export async function listChildrensService(user: IUser) {
  const parent = await ParentRepository.findByUser(
    user._id as unknown as string,
  );

  if (!parent) throw new Error("Responsável não encontrado.");

  return asArray(parent.filhos).map(formatChild);
}

export async function getChildDetailsService(user: IUser, studentId: string) {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("ID do aluno inválido.");
  }

  const parent = await ParentRepository.findByUserAndChild(
    user._id as unknown as string,
    studentId,
  );

  if (!parent) {
    throw new Error("Aluno não vinculado a este responsável.");
  }

  const aluno = await studentModel
    .findById(studentId)
    .populate({
      path: "turma",
      select: "nome turno anoLetivo disciplinas",
      populate: {
        path: "disciplinas",
        select: "nome cargaHoraria quantidadeNotas descrição",
      },
    })
    .populate({
      path: "grades",
      select: "bimestre tipo nota data anoLetivo",
      populate: {
        path: "disciplina",
        select: "nome",
      },
    })
    .populate({
      path: "frequencia.disciplina",
      select: "nome",
    });

  if (!aluno) throw new Error("Aluno não encontrado.");

  const turmas = asArray(aluno.turma);
  const grades = asArray(aluno.grades)
    .map((grade: any) => ({
      id: grade?._id,
      bimestre: grade?.bimestre,
      tipo: grade?.tipo,
      nota: grade?.nota,
      data: grade?.data,
      anoLetivo: grade?.anoLetivo,
      disciplina: grade?.disciplina
        ? {
            id: grade.disciplina._id,
            nome: grade.disciplina.nome,
          }
        : null,
    }))
    .sort((a: any, b: any) => {
      const bimestreDiff = Number(b.bimestre) - Number(a.bimestre);
      if (bimestreDiff !== 0) return bimestreDiff;

      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });

  const frequencia = asArray(aluno.frequencia)
    .map((registro: any) => ({
      id: registro?._id,
      data: registro?.data,
      status: registro?.status,
      disciplina: registro?.disciplina
        ? {
            id: registro.disciplina._id,
            nome: registro.disciplina.nome,
          }
        : null,
    }))
    .sort(
      (a: any, b: any) =>
        new Date(b.data).getTime() - new Date(a.data).getTime(),
    );

  return {
    id: aluno._id,
    nome: aluno.nome,
    matricula: aluno.matricula,
    status: aluno.status,
    dataNasc: aluno.dataNasc,
    sexo: aluno.sexo,
    turma: turmas.map(formatTurma),
    grades,
    frequencia,
  };
}
