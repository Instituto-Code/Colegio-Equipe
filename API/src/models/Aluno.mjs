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
    frequencia: [{
        disciplina: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Disciplina" // => relacionamento com o modela da Disciplina
        },
        //Comparecimentos
        presenças: Number,

        //Faltas
        faltas: Number
    }]
}, { timestamps: true });

export default mongoose.model("Aluno", AlunoSchema);