import { CustomRequest } from "../../middlewares/authGuard.js";
import { Response } from "express";
import { RegisterEventService } from "./services/eventAction.service.js";
import { ListAllEventsService } from "./services/eventList.service.js";

//Registro de Eventos
export const registerEvent = async (req: CustomRequest, res: Response) => {
    try{

        const { titulo, descricao, data, tipo } = req.body;

        const userId = req.user._id;

        const dataRequest = {
            userId,
            titulo,
            descricao,
            data,
            tipo
        }

        const result = await RegisterEventService(dataRequest);

        res.status(201).json(result);
        

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

        const result = await ListAllEventsService();

        res.status(200).json(result);

    }
    catch(error: any){
        console.log(error);
        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    };
};