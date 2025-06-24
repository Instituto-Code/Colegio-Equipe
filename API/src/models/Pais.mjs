import mongoose, { Schema } from "mongoose";


const PaisSchema = new Schema({
    //Relacionamento com usuário
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    //Filhos relacionados aos pais
    filhos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aluno"
    }]
});

export default mongoose.model("Pais", PaisSchema);