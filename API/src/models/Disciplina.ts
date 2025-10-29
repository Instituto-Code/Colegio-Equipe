import mongoose, { Schema, Types, Document } from 'mongoose';

interface IDisciplina {
  nome: string;
  descrição: string;
  cargaHoraria: number;
}

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
