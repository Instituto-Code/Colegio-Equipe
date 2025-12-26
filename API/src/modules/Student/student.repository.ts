import studentModel from "./student.model.js";

export const StudentRepository = {
    async findById(studentId: string){
        return await studentModel.findById(studentId);
    },

    async findOne(identification: string){
        return await studentModel.findOne({ matricula: identification });
    },

    async create(data: any){
        return await studentModel.create(data);
    },
}