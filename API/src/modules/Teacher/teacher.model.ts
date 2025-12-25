import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProfessor } from '../../shared/types/teacher.type.js';

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
