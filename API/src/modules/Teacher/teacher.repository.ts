import teacherModel from "./teacher.model.js";

export const TeacherRepository = {
    async findByUser(userId: string){
        return await teacherModel.findOne({ user: userId });
    },

    async create(data: any){
        return await teacherModel.create(data);
    }
}