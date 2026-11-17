import { IUser } from "../../../shared/types/user.type.js";
import { TeacherRepository } from "../teacher.repository.js";

function formatTeacherClasses(teacher: any) {
  return (teacher.turmas ?? []).map((turma: any) => ({
    id: turma._id,
    nome: turma.nome,
    turno: turma.turno,
    anoLetivo: turma.anoLetivo,
    alunos: (turma.alunos ?? [])
      .filter((aluno: any) => aluno)
      .map((aluno: any) => ({
        id: aluno._id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        status: aluno.status,
      })),
    disciplinas: (turma.disciplinas ?? [])
      .filter((disciplina: any) => disciplina)
      .map((disciplina: any) => ({
        id: disciplina._id,
        nome: disciplina.nome,
        cargaHoraria: disciplina.cargaHoraria,
        quantidadeNotas: disciplina.quantidadeNotas,
        descricao: disciplina.descricao,
      })),
  }));
}

export async function ListClasses(user: IUser) {
  const teacher = await TeacherRepository.findByUser(
    user._id as unknown as string,
  );

  if (!teacher) throw new Error("Professor não encontrado.");

  return formatTeacherClasses(teacher);
}

export async function ListDisciplines(user: IUser) {
  const teacher = await TeacherRepository.findByUser(
    user._id as unknown as string,
  );

  if (!teacher) throw new Error("Professor não encontrado.");

  const disciplinas = new Map<string, any>();

  for (const turma of teacher.turmas as any[]) {
    for (const disciplina of turma.disciplinas ?? []) {
      if (!disciplina) continue;

      disciplinas.set(String(disciplina._id), {
        id: disciplina._id,
        nome: disciplina.nome,
        cargaHoraria: disciplina.cargaHoraria,
        quantidadeNotas: disciplina.quantidadeNotas,
        descricao: disciplina.descricao,
        turmas: Array.from(
          new Set([
            ...(disciplinas.get(String(disciplina._id))?.turmas ?? []),
            String(turma._id),
          ]),
        ),
      });
    }
  }

  return Array.from(disciplinas.values()).sort((a, b) =>
    a.nome.localeCompare(b.nome),
  );
}
