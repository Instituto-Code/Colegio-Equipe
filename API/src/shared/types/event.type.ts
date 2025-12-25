import { Types } from "mongoose";

export interface IEvent {
    titulo: string;
    descricao?: string;
    data: Date;
    tipo: 'feriado' | 'reunião' | 'aviso' | 'férias' | 'prova';
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}