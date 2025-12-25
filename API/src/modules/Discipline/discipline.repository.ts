import disciplineModel from "./discipline.model.js";

export const DisciplineRepository = {
    async findById(disciplineId: string){
        return await disciplineModel.findById(disciplineId);
    }
}