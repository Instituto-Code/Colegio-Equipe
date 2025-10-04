import mongoose, { Schema, Types } from 'mongoose';

interface INotificacao {
  author: Types.ObjectId;
  conteudo: string;
  tipo: 'pessoa' | 'grupo';
  pessoa: Types.ObjectId;
  grupo: 'aluno' | 'responsavel' | 'professor' | 'pendente';
  visto: Types.ObjectId[];
}

const NotificacaoSchema = new Schema<INotificacao>({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  conteudo: {
    type: String,
    required: true,
  },

  tipo: {
    type: String,
    enum: ['pessoa', 'grupo'],
  },
  
  grupo: {
    type: String,
    enum: ['aluno', 'responsavel', 'professor', 'pendente'],
  },
  visto: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default mongoose.model('Notificacao', NotificacaoSchema);
