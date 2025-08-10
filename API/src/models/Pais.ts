import mongoose, { Schema, Types, Document } from 'mongoose';

interface IPais {
  user: Types.ObjectId;
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
