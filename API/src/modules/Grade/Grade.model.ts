import mongoose, { Schema } from 'mongoose';
import { INota } from '../../shared/types/student.type.js';

const GradeSchema = new Schema({
  aluno: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  disciplina: {
    type: Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: true,
  },
  professor: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  tipo: { type: String, required: true }, // Ex: 'Bimestre 1', 'Trabalho', 'Recuperação'
  nota: { type: Number, required: true },
  data: { type: Date, default: Date.now },
  anoLetivo: { type: Number, default: 2026 },
});


export default mongoose.model("Grade", GradeSchema);