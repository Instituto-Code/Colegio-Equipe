import parentsModel from "./parents.model.js";

export const ParentRepository = {
    async findByUser(userId: string){
        return await parentsModel.findOne({ user: userId }).populate({
            path: "filhos",
            select: "nome matricula status dataNasc sexo turma",
            populate: {
                path: "turma",
                select: "nome turno anoLetivo",
            },
        });
    },

    async findByUserAndChild(userId: string, studentId: string){
        return await parentsModel.findOne({ user: userId, filhos: studentId });
    },

    async create(data: any){
        return await parentsModel.create(data);
    } 
}