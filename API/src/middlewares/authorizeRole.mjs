
//Middleware de proteção de rota com base no role do usuário
export const authorizeRole = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role){
            return res.status(422).json({ errors: ["Acesso negado!"] });
        }
        return next();
    }
}