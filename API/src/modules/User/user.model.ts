import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../../shared/types/user.type.js';



const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      select: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cpf: {
      type: String,
    },
    dataNasc: {
      type: Date,
    },
    numberTel: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    adress: {
      rua: String,
      numero: String,
      bairro: String,
      cidade: String,
      estado: String,
      cep: String,
    },

    resetPassToken: {
      type: String,
    },

    resetPassTokenExpires: {
      type: Date,
    },

    role: {
      type: String,
      enum: [
        'coordenador',
        'aluno',
        'responsavel',
        'professor',
        'pendente',
        'admin',
      ],
      default: 'pendente',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
