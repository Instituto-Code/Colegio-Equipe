import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cpf: {
        type: String
    },
    dataNasc: {
        type: Date
    },
    numberTel: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    adress: {
        rua: String,
        numero: String,
        bairro: String,
        cidade: String,
        estado: String,
        cep: String,
    },
    role: {
        type: String,
        enum: ["coordenador", "aluno", "responsável", "professor", "pendente"],
        default: "pendente"
    },
    active:{
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);

