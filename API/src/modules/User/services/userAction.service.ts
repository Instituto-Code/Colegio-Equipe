import bcrypt from "bcryptjs";
import { UserRepository } from "../user.repository.js";
import GenerateToken from "../../../services/jwt/generateToken.js";
import { IUser } from "../../../shared/types/user.type.js";
import { UpdateUser } from "../../../shared/dto/user.dto.js";
import { cloudinary } from "../../../services/cloud/cloudinary.js";
import crypto from "crypto";
import { SendMail } from "../../../services/sendEmail.js";


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
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        cpf: user.cpf,
        dataNasc: user.dataNasc,
        numberTel: user.numberTel,
        adress: user.adress,
        avatarUrl: user.avatarUrl

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

// Foto de perfil
export async function PhotoProfileService(userId: string, file: Express.Multer.File | undefined){

    if(!file) throw new Error("Arquivo não enviado.");

    const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
            folder: 'avatars',
            public_id: `user-${userId}`,
            overwrite: true,
            transformation: [
                { width: 300, height: 300, crop: 'fill'}
            ]
        }
    );

    const user = await UserRepository.findById(userId);

    if(!user) throw new Error("Usuário não encontrado.");

    user.avatarUrl = result.secure_url;

    await user.save();

    return result

}

export async function SendMailResetService(email: string) {

    const user = await UserRepository.findByEmail(email);

    if(!user) throw new Error("Usuário não encontrado.");

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex")

    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    user.resetPassToken = tokenHash;
    user.resetPassTokenExpires = expiresAt;

    await user.save();

    const FRONT_URL = process.env.FRONTEND_URL;

    await SendMail(
        user.email,
        "Modificação de Senha",
        `
            <h1>Olá, ${user.name}!</h1>
            <p>Clique no link abaixo para modificar sua senha:</p>
            <a href="${FRONT_URL}/reset-password?token=${rawToken}">
            Redefinir senha
            </a>
            <p>Este link expira em 15 minutos.</p>   
        `
    )

    return {
        msg: "Se o email existir, enviamos um link de redefinição."
    }
}

export async function ResetPasswordService(token: string, password: string){
    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    const userByToken = await UserRepository.findByToken(tokenHash);

    if(!userByToken) throw new Error("Token inválido ou expirado.");

    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    userByToken.password = hashPass;

    userByToken.resetPassToken = undefined;
    userByToken.resetPassTokenExpires = undefined;

    userByToken.save();

    return {
        msg: "Senha atualizada com sucesso."
    }
}

