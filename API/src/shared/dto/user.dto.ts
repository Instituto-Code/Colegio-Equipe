import { IAddress } from "../types/user.type.js";

export type CreateUser = {
    name: string;
    email: string;
    password: string
}

export type UpdateUser = {
    name: string, 
    avatarUrl?: string,
    password: string, 
    cpf: string, 
    numberTel: string, 
    dataNasc: Date, 
    adress: IAddress,
}