import { Types } from "mongoose";
import { UserRepository } from "../../User/user.repository.js";
import { EventRepository } from "../event.repository.js";

type DataRequestRegister = {
    userId: string,
    titulo: string,
    descricao: string,
    data: Date,
    tipo: string
}

export async function RegisterEventService(data: DataRequestRegister) {
    const user = await UserRepository.findById(data.userId);

    if (!user) throw new Error("Usuário não encontrado");

    const userObjectId = new Types.ObjectId(user._id);

    const dataRequest = {
        userId: userObjectId,
        titulo: data.titulo,
        descricao: data.descricao,
        data: data.data,
        tipo: data.tipo,
        author: userObjectId
    }

    const newEVent = await EventRepository.create(dataRequest);

    return {
        msg: "Evento criado com sucesso",
        newEVent
    }
}   