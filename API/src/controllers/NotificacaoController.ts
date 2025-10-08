import Notificacoes from "../models/Notificacoes.js";
import { Response } from "express";

import { CustomRequest } from "../middlewares/authGuard.js";

export const createNote = async (req: CustomRequest, res: Response) => {
    try{
        const { conteudo, tipo } = req.body;
        const authorId = req.user;

        await Notificacoes.create({
            author: authorId,
            conteudo,
            tipo,
        });

        res.status(201).json({
            message: "Notificação criada com sucesso!"
        });
        
    }
    catch(error){
        res.status(500).json({
            error: "Erro interno do servidor!"
        });
        console.error(error);
    }
};

 export const deleteNote = async (req: CustomRequest, res:Response) => {
    try {
        const { id } = req.params;

        const note = await Notificacoes.findByPK(id);
        if (!note) {
            return res.status(404).json({error: "Notificação não encontrada!" });
        }
        await note.destroy();
        res.status().json({message: "Notificação excluída com sucesso!"});
    }
    catch (error) {
        res.status(500).json({error: "Erro interno no servidor"});
        console.error(error);
    }
 }