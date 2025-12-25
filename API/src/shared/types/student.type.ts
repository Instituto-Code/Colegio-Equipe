import { Document, Types } from "mongoose";
import { ITurma } from "../../models/Turma.js";
import { IPais } from "../../modules/Parents/parents.model.js";

type Sexo = 'masculino' | 'feminino';

export interface INota {
  disciplina: Types.ObjectId;
  professor: string | Types.ObjectId;
  tipo: string;
  nota: number;
  data: Date;
}

interface IFrequencia {
  presencas: number;
  faltas: number;
  data: Date;
}

export interface IAnotacao {
  professor: Types.ObjectId | string;
  anotacao: string;
  data?: Date;
}

export interface IAluno extends Document {
  nome: string;
  matricula: string;
  dataNasc?: Date;
  cpf: string;
  sexo: Sexo;
  status: 'ativo' | 'inativo' | 'suspenso',
  turma?: Types.ObjectId[] | ITurma[];
  parents: (Types.ObjectId | IPais)[];
  notas: INota[];
  frequencia: IFrequencia;
  anotacoes: IAnotacao[];
}
