import jwt from 'jsonwebtoken'
import User from '../models/User.mjs'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const authGuard = async(req,res,next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1] // Pega o token e verifica se existe um cabeçalho
    if(!token){
        return res.status(401).json({
            errors: ["Acesso Negado!"]
        })
    }
    try{
        const verification = jwt.verify(token, JWT_SECRET) // Verificação do token
        req.user = await User.findById(verification.id).select("-password")
        next()
    }
    catch(errors){
        console.log(errors)
        return res.status(500).json({
            errors: ["Erro interno do servidor"]
        })
    }
}
