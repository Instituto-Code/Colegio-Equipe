import { IUser } from "../../../shared/types/user.type.js";
import { ParentRepository } from "../parents.repository.js";

export async function listChildrensService(user: IUser){
    const parent = await ParentRepository.findByUser(user._id as unknown as string);

    if(!parent) throw new Error("Responsável não encontrado.");

    const childrens = parent.filhos;

    return childrens;
}