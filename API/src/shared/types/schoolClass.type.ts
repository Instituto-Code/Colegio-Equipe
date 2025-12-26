import { Types } from "mongoose";

export interface ITurma {
  _id: Types.ObjectId;
  nome: string;
  turno: 'manhã' | 'tarde';
  anoLetivo: number;
  alunos: Types.ObjectId[];
  professores: Types.ObjectId[];
  disciplinas: Types.ObjectId[];
}