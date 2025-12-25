import eventModel from "./event.model.js";

export const EventRepository = {
    async create(data: any){
        return await eventModel.create(data);
    },

    async findAll(){
        return await eventModel.find()
        .populate("author", "nome role")
        .sort({ data: 1 })
    }
}