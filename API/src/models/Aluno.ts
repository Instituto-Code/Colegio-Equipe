import mongoose, { Schema, Document, Types, trusted } from 'mongoose';
import { IPais } from './Pais.js';

type Sexo = 'masculino' | 'feminino';

export interface INota {
  disciplina: Types.ObjectId;
  professor: string | Types.ObjectId;
  tipo: string;
  nota: number;
  data: Date;
}

interface IFrequencia {
  presencas: number;
  faltas: number;
  data: Date;
}

export interface IAnotacao {
  professor: Types.ObjectId | string;
  anotacao: string;
  data?: Date;
}

export interface IAluno extends Document {
  nome: string;
  matricula: string;
  dataNasc?: Date;
  cpf: string;
  sexo: Sexo;
  status: 'ativo' | 'inativo' | 'suspenso',
  turma?: Types.ObjectId[];
  parents: (Types.ObjectId | IPais)[];
  notas: INota[];
  frequencia: IFrequencia;
  anotacoes: IAnotacao[];
}

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

    //notas
    notas: [
      {
        disciplina: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Disciplina', // => relacionamento com o modela da Disciplina
        },

        //Professor relacionado com a nota
        professor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Professor',
        },

        //Tipo de nota, se é atividade prova etc
        tipo: String,

        //Notas
        nota: Number,

        data: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    //frequencia
    frequencia: {
      //Comparecimentos
      presencas: {
        type: Number,
        default: 0,
      },

      //Faltas
      faltas: {
        type: Number,
        default: 0,
      },

      data: {
        type: Date,
        default: Date.now,
      },
    },

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
