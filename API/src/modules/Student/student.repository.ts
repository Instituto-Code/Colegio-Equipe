import studentModel from './student.model.js';

export const StudentRepository = {
  async findById(studentId: string) {
    return await studentModel.findById(studentId);
  },

  async findOne(identification: string) {
    return await studentModel.findOne({ matricula: identification });
  },

  async create(data: any) {
    return await studentModel.create(data);
  },

  async getStudentByClass() {
    return await studentModel.aggregate([
      {
        $unwind: '$turma',
      },
      {
        $group: {
          _id: '$turma',
          totalAlunos: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'turmas',
          localField: '_id',
          foreignField: '_id',
          as: 'turma',
        },
      },

      { $unwind: '$turma' },

      {
        $project: {
          _id: 0,
          turmaId: '$turma._id',
          turma: '$turma.nome',
          turno: '$turma.turno',
          anoLetivo: '$turma.anoLetivo',
          totalAlunos: 1,
        },
      },

      {
        $sort: {
          anoLetivo: 1,
          turma: 1,
        },
      },
    ]);
  },
};
