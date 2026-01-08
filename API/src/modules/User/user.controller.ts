import { CustomRequest } from "../../middlewares/authGuard.js";
import { Response } from "express";
import { EditProfileService, LoginService, PhotoProfileService, ProfileService, RegisterService } from "./services/userAction.service.js";
import Logger from "../../../config/logger.js";

//Função para login
export async function Login (req: CustomRequest, res: Response) {
  const { email, password } = req.body;

  try {
    const result = await LoginService(email, password);
  
    //Retornando usuário logado
    res.status(200).json(result);
    
  } catch (error) {
    Logger.error(`Erro interno do servidor: ${error}`);
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
  }
};

//Função para registrar usuário
export async function Register(req: CustomRequest, res: Response) {
  //Pegando dados da requisição
  const { name, email, password } = req.body;

  try {

    const result = await RegisterService(name, email, password);

    //Resposta com o id e token de usuário
    res.status(200).json(result);
    
  } catch (error) {
    Logger.error(`Erro interno do servidor: ${error}`);
    res.status(500).json({ msg: 'Erro interno do servidor!' });
  }
};

//Função para perfil de usuário
export async function Profile(req: CustomRequest, res: Response){
    const user = req.user;

    const result = await ProfileService(user);

    res.status(200).json(result);
}

//Edição de nome e senha de usuário (pode mudar as possibilidades futuramente)
export async function EditProfile(req: CustomRequest, res: Response){

  const { name, password, cpf, numberTel, dataNasc, adress } = req.body;
  
  const userId = req.user._id;

  try {
    
    const data = {
      name, 
      password,
      cpf,
      numberTel,
      dataNasc,
      adress
    }
    const result = await EditProfileService(userId, data);

    res.status(201).json(result);
  } catch (error) {
    Logger.error(`Erro interno do servidor: ${error}`);
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
  }
};

// Modificação de foto de perfil
export async function PhotoProfileController(req: CustomRequest, res: Response){
  try{

    const userId = req.user._id;

    const file = req.file;

    const result = await PhotoProfileService(userId, file);

    res.status(200).json({avatarUrl: result.secure_url});

  }
  catch (error) {
    Logger.error(`Erro interno do servidor: ${error}`);
    res.status(500).json({ errors: ['Erro interno do servidor!'] });
  }
}

