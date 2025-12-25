import mongoose, { Schema, Types } from 'mongoose';
import { INotificacao } from '../../shared/types/notification.type.js';

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
