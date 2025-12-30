import { ParentRepository } from "../../Parents/parents.repository.js";
import { TeacherRepository } from "../../Teacher/teacher.repository.js";
import { UserRepository } from "../../User/user.repository.js";
import { AdminRepository } from "../admin.repository.js"

type role = 
        |'coordenador'
        |'aluno'
        |'responsavel'
        |'professor'
        |'pendente'
        |'admin'

type dataRequest = {
    role: role
    matricula?: string,
    formacao?: string
}

export async function ModifyDataUserService(adminId: string, userId: string, data: dataRequest){
    const admin = await AdminRepository.findByUser(adminId);

    if (!admin) throw new Error("Admin não encontrado.");

    const user = await UserRepository.findById(userId);

    if (!user) throw new Error("Usuário não encontrado.");

    if (data.role) user.role = data.role;

    if(data.role === "responsavel") {
        const data = {
            user: userId
        }
        await ParentRepository.create(data);
    }

    if(data.role === "professor"){
        const dataCreate = {
            user: userId,
            matricula: data.matricula,
            formacao: data.formacao
        }

        await TeacherRepository.create(dataCreate);
    }

    await user.save();

    return {
        msg: "Dados atualizados com sucesso."
    }

}