import { CustomRequest } from "../middlewares/authGuard.js";
import { Response } from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";

//Registro de Eventos
export const registerEvent = async (req: CustomRequest, res: Response) => {
    try{

        const { titulo, descricao, data, tipo } = req.body;

        const userId = req.user._id;

        const user = await User.findById(userId)
            .select("-password");

        if(!user){
            return res.status(404).json({
                error: "Usuário não encontrado"
            });
        };

        const newEVent = await Event.create({
            titulo,
            descricao,
            data,
            tipo,
            author: userId
        });

        res.status(201).json({
            message: "Evento cadastrado com sucesso!",
            event: newEVent
        });
        

    }
    catch(error: any){
        console.log(error);
        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    };
};

//Listando eventos
export const listEvents = async (req: CustomRequest, res: Response) => {
    try{    

        const events = await Event.find()
            .populate("author", "nome role")
            .sort({ data: 1 })

        res.status(200).json(events);

    }
    catch(error: any){
        console.log(error);
        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    };
};