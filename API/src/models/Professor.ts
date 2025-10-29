import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User.js';

export interface IProfessor extends Document {
  _id: Types.ObjectId | string;
  user?: Types.ObjectId | IUser;
  nome?: string;
  matricula: string;
  formacaoAcademica?: string;
  disciplinas: Types.ObjectId[];
  turmas: Types.ObjectId[];
}

//Modelo de professores
const ProfessorSchema = new Schema<IProfessor>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    nome: {
      type: String,
    },
    matricula: {
      type: String,
      unique: true,
      required: true,
    },

    formacaoAcademica: {
      type: String,
    },

    turmas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turma',
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IProfessor>('Professor', ProfessorSchema);
