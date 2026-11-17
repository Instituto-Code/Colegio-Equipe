import teacherModel from './teacher.model.js';

export const TeacherRepository = {
  async findByUser(userId: string) {
    return await teacherModel.findOne({ user: userId }).populate({
      path: 'turmas',
      populate: [
        {
          path: 'disciplinas',
          select: 'nome cargaHoraria quantidadeNotas descricao',
        },
        {
          path: 'alunos',
          select: 'nome matricula status',
        },
      ],
    });
  },

  async create(data: any) {
    return await teacherModel.create(data);
  },

  async findById(teacherId: string) {
    return await teacherModel.findById(teacherId)
  }

};
