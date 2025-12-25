import mongoose, { Schema, Types } from 'mongoose';
import { IEvent } from '../../shared/types/event.type.js';

const EventSchema = new Schema<IEvent>({
    
  titulo: { type: String, required: true },

  descricao: String,

  data: { type: Date, required: true },

  tipo: {
    type: String,
    enum: ['feriado', 'reunião', 'aviso', 'férias', 'prova'],
    default: 'aviso',
  },

  author: { type: Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });


export default mongoose.model<IEvent>('Event', EventSchema);
