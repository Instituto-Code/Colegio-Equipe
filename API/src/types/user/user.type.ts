// Tipagem para o banco

import { Document } from "mongoose";

//Tipagem de endereço
export interface IAddress {
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

//Tipagem de usuário
export interface IUser extends Document {
  name: string ;
  email: string;
  cpf?: string;
  dataNasc?: Date;
  numberTel?: string;
  password: string;
  adress?: IAddress;
  resetPassToken?: string;
  resetPassTokenExpires?: Date;
  role?:
    | 'coordenador'
    | 'aluno'
    | 'responsavel'
    | 'professor'
    | 'pendente'
    | 'admin';
  active?: boolean;
}