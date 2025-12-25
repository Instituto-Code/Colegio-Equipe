import { NotificationRepository } from "../notification.repository.js"
import { getConnectedUsers, getIO } from "../../../services/socket.js";
import { Types } from "mongoose";
import { UserRepository } from "../../User/user.repository.js";

type DataRequestNotification = {
    authorId: string,
    conteudo: string,
    tipo: "pessoa" | "grupo",
    pessoa: string,
    grupo: 'aluno' | 'responsavel' | 'professor' | 'pendente'
}

export async function CreateNotificationService(data: DataRequestNotification) {

    //Validações
    if (!data.conteudo || !data.tipo) throw new Error("Campos Obrigatórios ausentes!");

    if (data.tipo === "pessoa" && !data.pessoa) throw new Error("Campo 'pessoa' indefinido!");

    if (data.tipo === "grupo" && !data.grupo) throw new Error("Campo 'grupo' indefinido!");

    //Criando notificações na base de dados
    const newNotification = await NotificationRepository.create({
        author: data.authorId,
        conteudo: data.conteudo,
        tipo: data.tipo,
        pessoa: data.tipo === "pessoa" ? data.pessoa : undefined,
        grupo: data.tipo === "grupo" ? data.grupo : undefined
    });

    const io = getIO();
    const connectedUsers = getConnectedUsers();

    //Enviando notificação para pessoa específica
    if (data.tipo === "pessoa" && data.pessoa) {
        const socketId = connectedUsers.get(data.pessoa);
        if (socketId) io.to(socketId).emit("new_notification", newNotification.toObject());
    }

    //Enviando para pessoa que faz parte de um grupo
    if (data.tipo === "grupo" && data.grupo) {
        console.log(`Emitindo notificação para o grupo: ${data.grupo}`);
        io.to(data.grupo).emit("new_notification", newNotification.toObject());
    }
}

//Deletar notificações
export async function DeleteNotificationService(id: string) {
    const note = await NotificationRepository.deleteById(id);

    if (!note) throw new Error("Notificação não encontrada!");

    return {
        msg: "Notificação deletada com sucesso."
    }
}

type DataRequestUpdate = {
    notificationId: string,
    conteudo?: string;
    tipo?: "pessoa" | "grupo";
    pessoa?: string;
    grupo?: 'aluno' | 'responsavel' | 'professor' | 'pendente';
}

//Atualizar notificações
export async function UpdateNotificationService(data: DataRequestUpdate) {
    const note = await NotificationRepository.findById(data.notificationId);

    if (!note) throw new Error("Notificação não encontrada!");

    //Validações de tipos
    if (data.tipo === "pessoa" && !data.pessoa) throw new Error("Campo 'pessoa' indefinido!");

    if (data.tipo === "grupo" && !data.grupo) throw new Error("Campo 'grupo' indefinido!")

    if (data.conteudo) note.conteudo = data.conteudo;

    //Validando os tipos na edição
    if (data.tipo) {
        note.tipo = data.tipo;
        if (data.tipo === "pessoa") {
            note.pessoa = data.pessoa
                ? new Types.ObjectId(data.pessoa)
                : note.pessoa;
            note.grupo = undefined;
        }

        else if (data.tipo === "grupo") {
            note.grupo = data.grupo || note.grupo;
            note.pessoa = undefined;
        };
    }
    else {
        if (data.grupo) note.grupo = data.grupo;

        if (data.pessoa) note.pessoa = data.pessoa
            ? new Types.ObjectId(data.pessoa)
            : note.pessoa;
    }

    await note.save();

    return {
        msg: "Notificação editada com sucesso."
    }
}

//Listar notificações
export async function ListNotificationGroupService(userId: string) {
    //Filtrando usuário logado
    const user = await UserRepository.findById(userId);

    if (!user) throw new Error("Usuário não encontrado");

    const tipo = "grupo";
    const grupo = user.role;

    const notificacoes = await NotificationRepository.find(tipo, grupo);

    const formatedData = notificacoes.map((n) => ({
        id: n._id,
        author: {
            id: n.author._id,
            nome: n.author.name,
            email: n.author.email
        },
        conteudo: n.conteudo,
        tipoEnvio: n.tipo,
        receptor: n.grupo,
        visto: n.visto
    }));

    return formatedData;
}

//View nas notificações
export async function ViewNotificationService(userId: string, noteId: string) {
    const user = await UserRepository.findById(userId);

    if (!user) throw new Error("Usuário não encontrado!");

    const note = await NotificationRepository.findById(noteId);

    if (!note) throw new Error("Notificação não encontrada");

    const userObjectId = new Types.ObjectId(userId);

    //Impede várias vizualizações
    if (!note.visto.includes(userObjectId)) {
        note.visto.push(userObjectId);
        await note.save();
    }

    //Recuperando dados da notificação atualizada
    const updatedNote = await NotificationRepository.findById(noteId)

    return {
        updatedNote
    }
}

//Listar notificações por usuário
export async function ListNotificationByUser(userId: string) {

    const user = await UserRepository.findById(userId);

    if (!user) throw new Error("Usuário não encontrado");

    const notificacoes = await NotificationRepository.findByUser(userId);

    const formatedData = notificacoes.map((n) => ({
        id: n._id,
        author: {
            id: n.author._id,
            nome: n.author.name,
            email: n.author.email,
        },
        conteudo: n.conteudo,
        tipo: n.tipo,
        receptor: {
            id: n.pessoa._id,
            nome: n.pessoa.name,
            email: n.pessoa.email,
            role: n.pessoa.role
        },
        visto: n.visto
    }));

    return formatedData;
}

//Listar todas as notificações
export async function ListAllNotificationService() {
    const notes = await NotificationRepository.findAllNotification();

    const formatedData = notes.map((n) => ({
        id: n._id,
        author: n.author ? {
            id: n.author._id,
            nome: n.author.name,
            email: n.author.email
        } : null,
        conteudo: n.conteudo,
        tipo: n.tipo,
        receptor: n.tipo === "grupo"
            ? n.grupo
            : n.pessoa ? {
                id: n.pessoa._id,
                nome: n.pessoa.name,
                email: n.pessoa.email,
                role: n.pessoa.role
            } : null
    }));

    return formatedData;
}
