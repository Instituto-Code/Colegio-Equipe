import mongoose, { Schema } from "mongoose";

//Modelo de professores
const ProfessorSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    nome: {
        type: String
    },
    matricula: {
        type: String,
        unique: true,
        required: true
    },

    formacaoAcademica: {
        type: String
    },

    disciplinas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disciplina",
    }],

    turmas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turma"
    }]
}, { timestamps: true });

export default mongoose.model("Professor", ProfessorSchema);