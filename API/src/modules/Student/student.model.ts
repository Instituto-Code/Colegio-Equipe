import mongoose, { Schema, Document, Types, trusted } from 'mongoose';
import { IAluno } from '../../shared/types/student.type.js';


//Modelo de aluno
const AlunoSchema = new Schema<IAluno>(
  {
    nome: {
      type: String,
      required: true,
    },

    //Matrícula
    matricula: {
      type: String,
      unique: true,
      required: true,
    },

    cpf: {
      type: String,
      unique: true
    },

    sexo: {
      type: String,
      enum: ['masculino', 'feminino']
    },

    status: {
      type: String,
      enum: ['ativo', 'inativo', 'suspenso'],
      default: 'ativo',
      required: true
    },

    dataNasc: {
      type: Date,
    },

    //Turma
    turma: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turma', // => relacionamento com o modela da turma
    }],

    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pais',
      },
    ],

    //Anotações
    anotacoes: [
      {
        //Professor responsável
        professor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Professor',
        },

        //Conteúdo
        anotacao: {
          type: String,
          required: true,
        },

        data: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IAluno>('Aluno', AlunoSchema);
