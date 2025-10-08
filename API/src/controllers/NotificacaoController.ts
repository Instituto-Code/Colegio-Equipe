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