// BimestreResult.ts
import mongoose, { Schema } from 'mongoose';
import { TBimestre } from '../../shared/types/bimestre.type.js';

const BimestreResultSchema = new Schema<TBimestre>({
  aluno: {
    type: Schema.Types.ObjectId,
    ref: 'Aluno',
    required: true,
  },

  disciplina: {
    type: Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: true,
  },

  bimestre: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },

  anoLetivo: {
    type: Number,
    required: true,
  },

  media: {
    type: Number,
    required: true,
  },

  fechado: {
    type: Boolean,
    default: true,
  },

  dataFechamento: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('BimestreResult', BimestreResultSchema);
