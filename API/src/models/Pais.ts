import mongoose, { Schema, Types, Document } from 'mongoose';
import { IUser } from './User.js';

export interface IPais {
  _id?: Types.ObjectId;
  user: Types.ObjectId | IUser;
  filhos: Types.ObjectId[];
}

const PaisSchema = new Schema<IPais>({
  //Relacionamento com usuário
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  //Filhos relacionados aos pais
  filhos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aluno',
    },
  ],
});

export default mongoose.model<IPais>('Pais', PaisSchema);
