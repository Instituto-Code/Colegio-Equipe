import mongoose, { Schema, Types } from 'mongoose';

interface IEvent {
    titulo: string;
    descricao?: string;
    data: Date;
    tipo: 'feriado' | 'reunião' | 'aviso' | 'férias' | 'prova';
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

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
