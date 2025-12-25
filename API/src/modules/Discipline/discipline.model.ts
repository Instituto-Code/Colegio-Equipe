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

    //Carga horária
    cargaHoraria: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDisciplina>('Disciplina', DisciplinaSchema);
