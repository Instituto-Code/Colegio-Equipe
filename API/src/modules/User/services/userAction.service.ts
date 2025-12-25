import bcrypt from "bcryptjs";
import { UserRepository } from "../user.repository.js";
import GenerateToken from "../../../services/jwt/generateToken.js";
import { IUser } from "../../../shared/types/user.type.js";
import { UpdateUser } from "../../../shared/dto/user.dto.js";
import { Types } from "mongoose";


export async function LoginService(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) throw new Error("Usuário não encontrado.");

    if (!(await bcrypt.compare(password, user.password))) {
        throw new Error("Senha incorreta.");
    }

    const token = await GenerateToken(user._id as unknown as string);

    return {
        id: user._id,
        token: token
    }
}

export async function RegisterService(name: string, email: string, password: string) {
    const user = await UserRepository.findByEmail(email);

    if (user) throw new Error("Usuário já existe.");

    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    const data = {
        name,
        email,
        password: hashPass
    }

    await UserRepository.create(data);

    return {
        msg: "Registro feito com sucesso.",
    }
}

export async function ProfileService(user: IUser) {
    const userFormated = {
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
    }

    return userFormated
}

//Função para editar dados do usuário
export async function EditProfileService(userId: string, data: UpdateUser) {
    const user = await UserRepository.findById(userId);

    if (!user) throw new Error("Usuário não encontrado.");

    //Atualizando nome
    if (data.name) {
        user.name = data.name;
    }

    //Atualizando senha
    if (data.password) {
        const salt = await bcrypt.genSalt();
        const newPass = await bcrypt.hash(data.password, salt);
        user.password = newPass;
    }

    if (data.cpf) {
        user.cpf = data.cpf;
    }

    if (data.numberTel) {
        user.numberTel = data.numberTel;
    }

    if (data.dataNasc) {
        user.dataNasc = data.dataNasc;
    }

    if (data.adress) {
        user.adress = data.adress;
    }

    //salvando usuário
    await user.save();
}