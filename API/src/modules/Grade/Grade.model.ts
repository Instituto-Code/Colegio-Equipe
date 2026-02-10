import mongoose, { Schema } from 'mongoose';

const GradeSchema = new Schema({
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
  professor: {
    type: Schema.Types.ObjectId,
    ref: 'Professor',
    required: true,
  },
  bimestre: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true
  },
  tipo: {
    type: String,
    required: true,
  }, 
  nota: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  anoLetivo: {
    type: Number,
    default: 2026,
  },
});

export default mongoose.model('Grade', GradeSchema);
