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
        discipline: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Disciplina" // => relacionamento com o modela da Disciplina
        },

        //Notas
        grade: Number
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