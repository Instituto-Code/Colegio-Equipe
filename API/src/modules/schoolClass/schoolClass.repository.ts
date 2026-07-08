import schoolClassModel from "./schoolClass.model.js";

export const SchoolClassRepository = {
    async findByName(className: string) {
        return await schoolClassModel.findOne({ nome: className });
    },

    async create(data: any) {
        return await schoolClassModel.create(data);
    },

    async removeByClass(id: string, className: string) {
        return await schoolClassModel.findOneAndUpdate(
            { nome: className },
            {
                $pull: {
                    alunos: id,
                    professores: id
                }
            },
            { new: true }
        )
    }
}