import { CreateUser, UpdateUser } from "../../shared/dto/user.dto.js";
import userModel from "./user.model.js";

export const UserRepository = {
    async findById(userId: string){
        return await userModel.findById(userId);
    },

    async findByEmail(email: string){
        return await userModel.findOne({ email: email });
    },

    async create(data: CreateUser){
        return await userModel.create(data);
    },

    async update(userId: string, data: UpdateUser){
        return await userModel.findByIdAndUpdate(userId, { data });
    }
}