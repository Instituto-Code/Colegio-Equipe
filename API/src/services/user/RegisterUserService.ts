import bcrypt from "bcryptjs";
import { UserRepository } from "../../repositories/UserRepository.js";

type DataRegister = {
    name: string;
    email: string;
    password: string;
};

export async function RegisterUserService({ name, email, password }: DataRegister){

    const userExist = await UserRepository.findByEmail(email);
    if (userExist) throw new Error("Usuário já existe.");

    const salts = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salts);

    const newUser = await UserRepository.create({
        name,
        email,
        password: hashPass
    });

    return {msg: `Registro feito com sucesso.`, user: newUser};
}