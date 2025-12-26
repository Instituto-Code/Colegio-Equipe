import { CustomRequest } from "../../middlewares/authGuard.js";
import { Response } from "express";
import { CreateNotificationService, DeleteNotificationService, ListAllNotificationService, ListNotificationByUser, ListNotificationGroupService, UpdateNotificationService, ViewNotificationService } from "./services/notificationAction.service.js";
import Logger from "../../../config/logger.js";

//Função de criar notificação
export const createNote = async (req: CustomRequest, res: Response) => {
    try {
        const { conteudo, tipo, pessoa, grupo } = req.body;

        const authorId = req.user._id;

        const data = {
            authorId,
            conteudo,
            tipo,
            pessoa,
            grupo
        }

        const result = await CreateNotificationService(data);

        res.status(201).json(result);

    }
    catch (error) {
        res.status(500).json({
            error: `Erro interno do servidor: ${error}`,
        });
        Logger.error(`Erro interno do servidor: ${error}`);
    }
};

//Deletando notificações
export const deleteNote = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;

        const result = await DeleteNotificationService(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            error: `Erro interno do servidor: ${error}`,
        });
        Logger.error(`Erro interno do servidor: ${error}`);
    }
}

//Editando notificações
export const updateNote = async (req: CustomRequest, res: Response) => {
    try {
        const { conteudo, tipo, pessoa, grupo } = req.body;

        const { notificationId } = req.params;

        const data = {
            notificationId,
            conteudo,
            tipo,
            pessoa,
            grupo
        }

        const result = await UpdateNotificationService(data);

        res.status(200).json(result);
    }

    catch (error) {
        res.status(500).json({
            error: `Erro interno do servidor: ${error}`,
        });
        Logger.error(`Erro interno do servidor: ${error}`);
    }
};

//Listando notificações por grupos
export const listNotesGroup = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user._id;

        const result = await ListNotificationGroupService(userId);

        return res.status(200).json(result);

    }
    catch (error: any) {
        res.status(500).json({
            error: `Erro interno do servidor: ${error}`,
        });
        Logger.error(`Erro interno do servidor: ${error}`);
    }
};

//  Views nas notificações
export const viewNotes = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { noteId } = req.params;

        const result = await ViewNotificationService(userId, noteId);

        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({
            error: `Erro interno do servidor: ${error}`,
        });
        Logger.error(`Erro interno do servidor: ${error}`);
    }
}

//Listando notificações por IDs
export const listNotesByUser = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user._id;

        const result = await ListNotificationByUser(userId);

        return res.status(200).json(result);
    }

    catch (error) {
        res.status(500).json({
            error: `Erro interno do servidor: ${error}`,
        });
        Logger.error(`Erro interno do servidor: ${error}`);
    }
}

//Listar todas as notificações para o coordenador (aba enviadas)
export const listAllNotes = async (req: CustomRequest, res: Response) => {
    try {

        const result = await ListAllNotificationService();

        res.status(200).json(result);
    }
    catch (error: any) {
        res.status(500).json({
            error: `Erro interno do servidor: ${error}`,
        });
        Logger.error(`Erro interno do servidor: ${error}`);
    }
}