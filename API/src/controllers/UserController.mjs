import User from "../models/User.mjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { sendResetPass } from "../services/sendEmail.mjs";
import crypto from "crypto"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

//Função para geração de token a partir do id de usuário
const generateToken = (id) => {
    return jwt.sign(
        { id },
        JWT_SECRET, //O token é inserido no token aqui!!
        { expiresIn: "7d" }
    )
}

//Função para registrar usuário
export const register = async (req, res) => {

    //Pegando dados da requisição
    const { 
        name, 
        email,  
        password, 
        role, 
        active,
        confirmPass
    } = req.body

    try{

        //Validações
        const user = await User.findOne({email})


        //Verificando se o usuário já existe
        if(user){
            return res.status(401).json({ errors: ["Usuário já existe!"] })
        }


        //Criptografia de senha
        const salt = await bcrypt.genSalt()
        const hashPass = await bcrypt.hash(password, salt)
        
        //Criando usuário no bd
        const newUser = await User.create({
            name, 
            email, 
            password: hashPass,  //Recebendo a senha criptografada
            role, 
            active
        })


        //Resposta com o id e token de usuário
       res.status(200).json({ 
            _id: newUser._id,
            token: generateToken(newUser._id)
       })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ msg: "Erro interno do servidor!" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try{

        const user = await User.findOne({ email })

        //Verificando se o usuário existe
        if(!user){
            return res.status(404).json({ errors: ["Usuário não encontrado!"] })
        }

        //Comparando senha
        if(!(bcrypt.compare(password, user.password))){
            return res.status(422).json({ errors: ["Senha incorreta!"] })
        }

        //Retornando usuário logado
        res.status(200).json({
            _id: user._id,
            token: generateToken(user._id)
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ errors: ["Erro interno do servidor!"] })
    }
}


//Acessando usuário logado
export const getCurentUser = async (req, res) => {
    const user = req.user
    console.log(user)
    res.status(200).json(user)
}

//Edição de nome e senha de usuário (pode mudar as possibilidades futuramente)

export const updateUser = async (req, res) => {
    const { 
        name, 
        password ,
        cpf,
        numberTel,
        dataNasc,
        adress
    } = req.body

    try{
        const userLogged = req.user
        const user = await User.findById(userLogged.id).select("-password")

        //Atualizando nome
        if(name){
            user.name  = name;
        }

        //Atualizando senha
        if(password){
            const salt = await bcrypt.genSalt();
            const newPass = await bcrypt.hash(password, salt);
            user.password = newPass;
        }

        if(cpf){
            user.cpf = cpf;
        }

        if(numberTel){
            user.numberTel = numberTel;
        }

        if(dataNasc){
            user.dataNasc = dataNasc;
        }

        if(adress){
            user.adress = adress;
        }

        //salvando usuário
        await user.save()

        res.status(201).json(user)

    }
    catch(error){
        console.log(error)
        res.status(500).json({ errors: ["Erro interno do servidor!"] })
    }
}

//MODIFICAÇÃO DE SENHA DO USUÁRIO NA TELA DE LOGIN

//Pegando dados e enviando email
export const resetPassMail = async (req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({
                errors: ["Usuário não encontrado!"]
            });
        }

        //Gerando token com o crypto
        const resetToken = crypto.randomBytes(32).toString("hex")

        //Criando o hash do token
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        //Salvando no schema do usuário
        user.resetPassToken = tokenHash;
        user.resetPassTokenExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/resetPass/${resetToken}`;

        //Enviando dados para a função de envio de email
        sendResetPass(email, resetLink);

        res.status(200).json({
            msg: "E-mail de redefinição enviado com sucesso!"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
    }
}

//Rota que modifica a senha
export const resetPass =  async (req, res) => {
    const { newPass } = req.body;
    const { token } = req.params;

    try{

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPassToken: tokenHash,
            resetPassTokenExpires: { $gt: Date.now() }
        });

        if(!user){
            return res.status(404).json({
                errors: ["Token expirado!"]
            });
        }

        //criptografando senha
        const salt = await bcrypt.genSalt();
        const passHash = await bcrypt.hash(newPass, salt);

        //Salvando nova senha
        user.password = passHash;

        //Limpando dados de redefinição do banco
        user.resetPassToken = undefined;
        user.resetPassTokenExpires = undefined

        await user.save();

        res.status(201).json({
            msg: "Senha redefinida com sucesso!"
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
    }
}
