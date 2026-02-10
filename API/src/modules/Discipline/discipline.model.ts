import mongoose, { Schema } from 'mongoose';
import { IDisciplina } from '../../shared/types/discipline.type.js';

const DisciplinaSchema = new Schema<IDisciplina>(
  {
    nome: {
      type: String,
      required: true,
    },

    descrição: {
      type: String,
    },

    quantidadeNotas: {
      type: Number,
      enum: [1, 3],
      default: 1,
    },

    //Carga horária
    cargaHoraria: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDisciplina>('Disciplina', DisciplinaSchema);
