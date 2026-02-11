import { DisciplineRepository } from "../../Discipline/discipline.repository.js";
import GradeModel from "../../Grade/Grade.model.js";
import bimestreModel from "../bimestre.model.js";

type RequestCloseBimestre = {
    studentId: string;
    disciplinaId: string;
    bimestre: 1 | 2 | 3 | 4;
    anoLetivo: number;
}

export async function CloseBimestreService(data: RequestCloseBimestre) {

    const disciplina = await DisciplineRepository.findById(data.disciplinaId);

    if(!disciplina) throw new Error("Disciplina não encontrada.");

    const fechado = await bimestreModel.findOne({
        aluno: data.studentId,
        disciplina: data.disciplinaId,
        bimestre: data.bimestre,
        anoLetivo: data.anoLetivo
    });

    if(fechado) throw new Error("Bimestre já foi fechado.");

    const notas = await GradeModel.find({
        aluno: data.studentId,
        disciplina: data.disciplinaId,
        bimestre: data.bimestre,
        anoLetivo: data.anoLetivo
    });

    if(notas.length !== disciplina.quantidadeNotas){
        throw new Error(
      `Quantidade de notas insuficiente. Esperado: ${disciplina.quantidadeNotas}`
    );
    }

    const soma = notas.reduce((acc, n) => acc + n.nota, 0);
    const media = soma / disciplina.quantidadeNotas;

    const result = await bimestreModel.create({
        aluno: data.studentId,
        disciplina: data.disciplinaId,
        bimestre: data.bimestre,
        anoLetivo: data.anoLetivo,
        media
    });

    return {
        msg: "Bimestre fechado com sucesso.",
        result
    }

}