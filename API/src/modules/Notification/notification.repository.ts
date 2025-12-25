import { IUser } from "../../shared/types/user.type.js";
import notificationModel from "./notification.model.js";

export const NotificationRepository = {
    async create(data: any) {
        return await notificationModel.create(data);
    },

    async deleteById(id: string) {
        return await notificationModel.findByIdAndDelete(id);
    },

    async findById(id: string) {
        return await notificationModel.findById(id)
            .populate("author", "nome role email")
            .populate("visto", "nome role email")
    },

    async find(tipo: string, grupo: "aluno" | "responsavel" | "professor" | "pendente" | "coordenador" | "admin" | undefined) {
        return await notificationModel.find({ tipo: tipo, grupo: grupo })
            .populate("author")
            .populate<{ author: IUser }>({
                path: "author",
                select: "nome email"
            })
            .sort({ createdAt: -1 });
    },

    async findByUser(userId: string) {
        return await notificationModel.find({ pessoa: userId })
            .populate<{ author: IUser }>({
                path: "author",
                select: "nome email"
            })
            .populate<{ pessoa: IUser }>("pessoa", "name email role")
            .sort({ createdAt: -1 });
    },

    async findAllNotification(){
        return await notificationModel.find()
        .populate<{ author: IUser }>("author", "name email")
        .populate<{ pessoa: IUser }>("pessoa", "name email role");
    }
}