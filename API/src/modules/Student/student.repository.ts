import studentModel from "./student.model.js";

export const StudentRepository = {
    async findById(studentId: string){
        return await studentModel.findById(studentId);
    }
}