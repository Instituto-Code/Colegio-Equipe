import { Document, Types } from "mongoose";
import { ITurma } from "./schoolClass.type.js";
import { IPais } from "../../modules/Parents/parents.model.js";

type Sexo = 'masculino' | 'feminino';

export interface INota {
  _id?: Types.ObjectId;
  aluno: Types.ObjectId;      
  disciplina: Types.ObjectId;  
  professor: Types.ObjectId;  
  valor: number;
  tipo: 'PROVA' | 'TRABALHO' | 'RECUPERACAO' | 'PROVA_GERAL';
  bimestre: 1 | 2 | 3 | 4;
  anoLetivo: number;           
  data: Date;
}

export interface IFrequencia {
  aluno: Types.ObjectId;
  disciplina: Types.ObjectId;
  data: Date;
  presente: boolean;           
  justificativa?: string;    
}

export interface IAnotacao {
  professor: Types.ObjectId | string;
  anotacao: string;
  data?: Date;
}

type StatusAluno = 'ativo' | 'inativo' | 'suspenso';

export interface IAluno extends Document {
  nome: string;
  matricula: string;
  dataNasc: Date;
  cpf: string;
  sexo: Sexo;
  status: StatusAluno;
  grades: Types.ObjectId[];
  turma: Types.ObjectId;
  
  parents: Types.ObjectId[]; 
  anotacoes: IAnotacao[];
  
  createdAt: Date;
  updatedAt: Date;
}
