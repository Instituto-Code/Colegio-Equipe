import { Types } from "mongoose";
import userModel from "../User/user.model.js";

export const AdminRepository = {
    async findByUser(userId: string) {
        return await userModel.findOne({ _id: new Types.ObjectId(userId), role: "admin" });
    }
}