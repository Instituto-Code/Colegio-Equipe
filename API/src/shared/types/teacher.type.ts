import { Types } from "mongoose";
import { IUser } from "./user.type.js";

export interface IProfessor {
  _id: Types.ObjectId | string;
  user?: Types.ObjectId | IUser;
  nome?: string;
  matricula: string;
  formacaoAcademica?: string;
  disciplinas: Types.ObjectId[];
  turmas: Types.ObjectId[];
}