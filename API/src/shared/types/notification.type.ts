import { Types } from "mongoose";
import { IUser } from "./user.type.js";

export interface INotificacao {
  author: Types.ObjectId | IUser;
  conteudo: string;
  tipo: 'pessoa' | 'grupo';
  pessoa?: Types.ObjectId | IUser;
  grupo?: 'aluno' | 'responsavel' | 'professor' | 'pendente';
  visto: Types.ObjectId[];
  createdAt: Date;
}