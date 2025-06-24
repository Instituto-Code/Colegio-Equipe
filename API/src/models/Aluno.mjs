import mongoose, { Schema } from "mongoose";

//Modelo de aluno
const AlunoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },

    //Matrícula
    matricula: {
        type: String,
        unique: true,
        required: true
    },

    dataNasc: {
        type: Date
    },

    //Turma
    turma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turma" // => relacionamento com o modela da turma 
    },

    parents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    //notas
    notas: [{
        disciplina: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Disciplina" // => relacionamento com o modela da Disciplina
        },

        //Professor relacionado com a nota
        professor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professor"
        },

        //Tipo de nota, se é atividade prova etc
        tipo: String,

        //Notas
        nota: Number,

        data: {
            type: Date,
            default: Date.now
        }
    }],

    //frequencia
    frequencia: {
        //Comparecimentos
        presencas: {
            type: Number,
            default: 0
        },

        //Faltas
        faltas: {
            type: Number,
            default: 0
        },

        data: {
            type: Date,
            default: Date.now
        }
    },

    //Anotações
    anotacoes: [{

        //Professor responsável
        professor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professor"
        },

        //Conteúdo
        anotacao: {
            type: String,
            required: true
        },

        data: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export default mongoose.model("Aluno", AlunoSchema);