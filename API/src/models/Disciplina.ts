import mongoose, { Schema, Types, Document } from 'mongoose';

interface IDisciplina {
  nome: string;
  descrição: string;
  cargaHoraria: number;
  professores: Types.ObjectId[];
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

    //Professores que lecionam a disciplina
    professores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher', //=> Relacionamento com os professores
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IDisciplina>('Disciplina', DisciplinaSchema);
