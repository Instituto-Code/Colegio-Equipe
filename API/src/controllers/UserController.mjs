import User from "../models/User.mjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import crypto from "crypto"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (id) => {
    return jwt.sign(
        { id },
        JWT_SECRET,
        { expiresIn: "7d" }
    )
}

//Função para registrar usuário
export const register = async (req, res) => {

    //Pegando dados da requisição
    const { 
        name, 
        email, 
        cpf, 
        dataNasc, 
        numberTel, 
        password, 
        adress, 
        role, 
        active 
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
            cpf, 
            dataNasc, 
            numberTel, 
            password: hashPass,  //Recebendo a senha criptografada
            adress, 
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