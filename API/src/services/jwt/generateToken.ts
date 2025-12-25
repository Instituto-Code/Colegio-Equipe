import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwt_secret = process.env.JWT_SECRET

async function GenerateToken(id: string){
    if(!jwt_secret) throw new Error("Variável de ambiente inválida.");

    return jwt.sign(
        { id },
        jwt_secret,
        { expiresIn: "7d" }
    )
}

export default GenerateToken;