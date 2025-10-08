import Notificacoes from "../models/Notificacoes.js";
import { Response } from "express";

import { CustomRequest } from "../middlewares/authGuard.js";

//Função de criar notificação
export const createNote = async (req: CustomRequest, res: Response) => {
    try{
        const { conteudo, tipo, pessoa, grupo } = req.body;

        const authorId = req.user;

        //Validações
        if(!conteudo || !tipo){
            return res.status(400).json({
                error: "Campos Obrigatórios ausentes!"
            });
        };

        if(tipo === "pessoa" && !pessoa){
            return res.status(400).json({
                error: "Campo 'pessoa' indefinido!"
            });
        };

        if(tipo === "grupo" && !grupo){
            return res.status(400).json({
                error: "Campo 'grupo' indefinido!"
            });
        };

        //Criando notificações na base de dados
        await Notificacoes.create({
            author: authorId,
            conteudo,
            tipo,
            pessoa: tipo === "pessoa" ? pessoa : undefined,
            grupo: tipo === "grupo" ? grupo : undefined           
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

//DEIXEI PARA PEGAR O ID PELO PARÂMETRO DA URL

//Deletando notificações
 export const deleteNote = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;

        const note = await Notificacoes.findByIdAndDelete(id);
        if (!note) {
            return res.status(404).json({error: "Notificação não encontrada!" });
        }
        res.status(200).json({message: "Notificação excluída com sucesso!"});
    }
    catch (error) {
        res.status(500).json({error: "Erro interno no servidor"});
        console.error(error);
    }
 }

 //Editando notificações
 export const updateNote = async (req: CustomRequest, res:Response) => {
    try {
        const { conteudo, tipo, pessoa, grupo } = req.body;

        const { id } = req.params;

        const note = await Notificacoes.findById(id);

        if(!note) {
            return res.status(404).json({error: "Notificação não encontrada!"});
        }

        //Validações de tipos
        if(tipo === "pessoa" && !pessoa){
            return res.status(400).json({
                error: "Campo 'pessoa' indefinido!"
            });
        };

        if(tipo === "grupo" && !grupo){
            return res.status(400).json({
                error: "Campo 'grupo' indefinido!"
            });
        };

        if (conteudo) note.conteudo = conteudo;

        //Validando os tipos na edição
        if (tipo){
            note.tipo = tipo;
            if(tipo === "pessoa"){
                note.pessoa = pessoa || note.pessoa;
                note.grupo = undefined;
            }

            else if(tipo === "grupo"){
                note.grupo = grupo || note.grupo;
                note.pessoa = undefined;
            };
        } 
        else{
            if (grupo) note.grupo = grupo;

            if (pessoa) note.pessoa = pessoa;
        } 

        await note.save();

        res.status(200).json({message: "Notificação atualizada com sucesso", note});
    }

    catch (error) {
        res.status(500).json({error: "Erro interno no servidor"});
        console.error(error);
    }
 }