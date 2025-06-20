import mongoose, { Schema } from "mongoose";


const DisciplinaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },

    descrição: {
        type: String
    },

    //Carga horária
    cargaHoraria: {
        type: Number,
        required: true
    }, 

    //Professores que lecionam a disciplina
    professores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher" //=> Relacionamento com os professores
    }]

}, { timestamps: true });

export default mongoose.model("Disciplina", DisciplinaSchema);