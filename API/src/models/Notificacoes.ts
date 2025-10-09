import mongoose, { Schema, Types } from 'mongoose';

interface INotificacao {
  author: Types.ObjectId;
  conteudo: string;
  tipo: 'pessoa' | 'grupo';
  pessoa?: Types.ObjectId;
  grupo?: 'aluno' | 'responsavel' | 'professor' | 'pendente';
  visto: Types.ObjectId[];
  createdAt: Date;
}

const NotificacaoSchema = new Schema<INotificacao>({

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  conteudo: {
    type: String,
    required: true,
  },

  tipo: {
    type: String,
    enum: ['pessoa', 'grupo'],
    required: true
  },

  pessoa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  grupo: {
    type: String,
    enum: ['aluno', 'responsavel', 'professor', 'pendente'],
  },

  visto: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },

}, { timestamps: true });

export default mongoose.model<INotificacao>('Notificacao', NotificacaoSchema);
