import { Types } from "mongoose"

export type TBimestre = {
    aluno: Types.ObjectId;
    disciplina: Types.ObjectId;
    bimestre: 1 | 2 | 3 | 4;
    anoLetivo: number;
    media: number;
    fechado: boolean;
    dataFechamento: Date
}