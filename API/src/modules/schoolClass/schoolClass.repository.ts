import schoolClassModel from "./schoolClass.model.js";

export const SchoolClassRepository = {
    async findByName(className: string){
        return await schoolClassModel.findOne({ nome: className });
    },

    async create(data: any){
        return await schoolClassModel.create(data);
    }
}