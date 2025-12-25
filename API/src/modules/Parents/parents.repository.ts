import parentsModel from "./parents.model.js";

export const ParentRepository = {
    async findByUser(userId: string){
        return await parentsModel.findOne({ user: userId }).populate("filhos", "nome");
    }
}