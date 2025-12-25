import teacherModel from "./teacher.model.js";

export const TeacherRepository = {
    async findByUser(userId: string){
        return await teacherModel.findOne({ user: userId });
    }
}