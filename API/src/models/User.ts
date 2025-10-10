import mongoose, { Schema, Document } from 'mongoose';

//Tipagem de endereço
interface IAddress {
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

//Tipagem de usuário
export interface IUser extends Document {
  name: string;
  email: string;
  cpf?: string;
  dataNasc?: Date;
  numberTel?: string;
  password: string;
  adress?: IAddress;
  resetPassToken?: string;
  resetPassTokenExpires?: Date;
  role?:
    | 'coordenador'
    | 'aluno'
    | 'responsavel'
    | 'professor'
    | 'pendente'
    | 'admin';
  active?: boolean;
}

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
