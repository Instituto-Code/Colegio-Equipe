import mongoose, { Schema } from "mongoose";

const TurmaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },

    turno: {
        type: String,
        enum: ["manhã", "tarde"],
        required: true
    },

    anoLetivo: {
        type: Number,
        required: true
    },

    //Relacionando alunos na Turma
    alunos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aluno"
    }],


    //Relacionando professores na Turma
    professores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professor"
    }],

    //Relacionando disciplinas na Turma
    disciplinas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disciplina"
    }]

}, { timestamps: true });

export default mongoose.model("Turma", TurmaSchema);